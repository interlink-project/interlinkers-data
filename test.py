import importlib
import json
from pathlib import Path


class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


error = False

# checks for schemas
for schema_path in Path(".").glob("**/schema.py"):
    str_path = str(schema_path)
    Schema = importlib.import_module(
        f"{schema_path.parents[0]}.{schema_path.stem}"
    ).Schema

    for metadata_path in Path(".").glob("**/metadata.json"):
        str_path = str(metadata_path)
        with open(str_path) as json_file:
            print(
                f"{bcolors.OKBLUE}################################################################################################"
            )
            print(f"## PROCESSING {bcolors.ENDC}{str_path}{bcolors.OKBLUE}")
            print(
                f"################################################################################################{bcolors.ENDC}"
            )

            data = json.load(json_file)
            try:
                Schema(**data)
                # if not valid, raises exception
            except Exception as e:
                error = True
                print(f"{bcolors.FAIL}ERROR DETECTED:")
                # print(traceback.format_exc())
                print(str(e) + bcolors.ENDC)

        if not Path(str(metadata_path.parents[0]) + "/snapshots").is_dir():
            print(
                f"{bcolors.WARNING} ## WARNING Snapshots directory not present{bcolors.ENDC}"
            )
    with open(f"{schema_path.parents[0]}/schema.json", "w") as f:
        json.dump(Schema.schema(), f, indent=4)

    error or print(
        f"\n{bcolors.OKGREEN}All checks passed for {schema_path}!{bcolors.ENDC}"
    )

if error:
    raise Exception("You should review your changes")