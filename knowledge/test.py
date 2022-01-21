from pathlib import Path
import json

error = False

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

class MandatoryException(Exception):
    def __init__(self, field):
        self.message = f"Field '{field}' is mandatory"
    def __str__(self) -> str:
        return self.message

class TypeException(Exception):
    def __init__(self, field, should_be_of_type, actual_value_type):
        self.message = f"Field '{field}' must be of type {should_be_of_type} (is {actual_value_type})"
    def __str__(self) -> str:
        return self.message

class OptionsException(Exception):
    def __init__(self, field, options, actual_value):
        self.message = f"Field '{field}' must be one of {options} (is '{actual_value}')"
    def __str__(self) -> str:
        return self.message


with open("schema.json") as schema_json:
    schema = json.load(schema_json)
    pathlist = Path(".").glob('**/data.json')
    for path in pathlist:
        # because path is object not string
        path_in_str = str(path)
        name = path_in_str.replace("data.json", "")
        print(f"{bcolors.OKBLUE}################################################################################################")   
        print(f"## PROCESSING {bcolors.ENDC}{name}{bcolors.OKBLUE}")     
        print(f"################################################################################################{bcolors.ENDC}")
        with open(path_in_str) as json_file:
            data = json.load(json_file)
            for field, properties in schema.items():
                try:
                    value = data[field]
                    
                    # Check if mandatory
                    if properties["mandatory"] and not value:
                        raise MandatoryException(field)
                    # Check if type valid
                    should_be_of_type = properties["type"]
                    actual_value_type = type(value).__name__
                    if actual_value_type != should_be_of_type:
                        raise TypeException(field, should_be_of_type, actual_value_type)
                    # 
                    if "options" in properties:
                        options = properties["options"]
                        if not value in options:
                            raise OptionsException(field, options, value)
                except Exception as e:
                    error = True
                    print(f"{bcolors.FAIL}ERROR DETECTED:")
                    print(str(e) + bcolors.ENDC)
                    
if not error:
    print(f"\n {bcolors.OKGREEN}All checks passed!")
                        
