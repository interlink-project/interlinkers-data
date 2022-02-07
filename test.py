import importlib
import json
from pathlib import Path
import sys

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


# boolean to know if an exception have occurred somewhere
general_error = False

# search for schemas
for schema_path in Path(".").glob("**/schema.py"):
    schema_error = False
    str_path = str(schema_path)

    # schema.py imported dynamically
    Schema = importlib.import_module(
        f"{schema_path.parents[0]}.{schema_path.stem}"
    ).Schema
    parent_path = schema_path.parents[0]

    # searches for metadata inside the parent directory where schema is located
    for metadata_path in Path(str(parent_path)).glob("**/metadata.json"):
        str_path = str(metadata_path)
        with open(str_path) as json_file:
            print(
                f"{bcolors.OKBLUE}################################################################################################"
            )
            print(f"## PROCESSING {bcolors.ENDC}{str_path}{bcolors.OKBLUE}")
            print(
                f"################################################################################################{bcolors.ENDC}"
            )

            # loads data from metadata.json and validates it
            data = json.load(json_file)
            try:
                Schema(**data)
            except Exception as e:
                # if not valid, raises exception, which is captured to continue the execution of the loop
                general_error = True
                schema_error = True
                print(f"{bcolors.FAIL}ERROR DETECTED:")
                print(str(e) + bcolors.ENDC)

        # Show warning if there is not snapshots directory where the metadata.json is located
        if not Path(str(metadata_path.parents[0]) + "/snapshots").is_dir():
            print(
                f"{bcolors.WARNING} ## WARNING Snapshots directory not present{bcolors.ENDC}"
            )
    
    # convert pydantic schema to jsonschema that non-technical users can use to validate data easily
    with open(f"{schema_path.parents[0]}/schema.json", "w") as f:
        json.dump(Schema.schema(), f, indent=4)

    # If this iteration has not thrown any exception, show "all checks passed" 
    schema_error or print(
        f"\n{bcolors.OKGREEN}All checks passed for {schema_path}!{bcolors.ENDC}"
    )

# if an exception has been thrown along the execution of the script, exit with error code
if general_error:
    sys.exit(1)
sys.exit(0)