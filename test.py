from pathlib import Path
import json
from jsonschema import validate

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# checks for schemas
schemas_paths = [str(path) for path in Path(".").glob('**/schema.json')]
for schema_path in schemas_paths:
    error = False
    with open(schema_path) as schema_json:
        schema = json.load(schema_json)

        # checks for artefacts to compare with schemas
        pathlist = Path(schema_path.replace("schema.json", "")).glob('**/metadata.json')
        
        for path in pathlist:
            path_in_str = str(path)
            name = path_in_str.replace("/metadata.json", "")
            
            with open(path_in_str) as json_file:
                print(f"{bcolors.OKBLUE}################################################################################################")   
                print(f"## PROCESSING {bcolors.ENDC}{name}{bcolors.OKBLUE}")     
                print(f"################################################################################################{bcolors.ENDC}")
                data = json.load(json_file)
                
                try:
                    validate(instance=data, schema=schema)    
                except Exception as e:
                    error = True
                    print(f"{bcolors.FAIL}ERROR DETECTED:")
                    # print(traceback.format_exc())
                    print(str(e) + bcolors.ENDC)
    
    error or print(f"\n{bcolors.OKGREEN}All checks passed for {schema_path}!{bcolors.ENDC}")
                
        
                            
