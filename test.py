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

def check(schema, data):
    print(f"{bcolors.OKBLUE}################################################################################################")   
    print(f"## PROCESSING {bcolors.ENDC}{name}{bcolors.OKBLUE}")     
    print(f"################################################################################################{bcolors.ENDC}")
    
    # If no exception is raised by validate(), the instance is valid.
    validate(instance=data, schema=schema)    

# checks for schemas
artefacts_paths = [str(path) for path in Path(".").glob('**/schema.json')]
for artefacts_path in artefacts_paths:
    with open(artefacts_path) as schema_json:
        schema = json.load(schema_json)

        # checks for artefacts to compare with schemas
        pathlist = Path(".").glob('knowledge/**/metadata.json')
        for path in pathlist:
            path_in_str = str(path)
            name = path_in_str.replace("/metadata.json", "")
            
            with open(path_in_str) as json_file:
                data = json.load(json_file)
                error = False
                try:
                    check(schema, data)
                except Exception as e:
                    error = True
                    print(f"{bcolors.FAIL}ERROR DETECTED:")
                    # print(traceback.format_exc())
                    print(str(e) + bcolors.ENDC)
    
    error or print(f"\n{bcolors.OKGREEN}All checks passed!{bcolors.ENDC}")
                
        
                            
