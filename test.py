from pathlib import Path
import json

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
    def __init__(self, field, actual_value):
        self.message = f"Value '{actual_value}' of field '{field}' is not valid"
    def __str__(self) -> str:
        return self.message

def obj_to_list(obj : dict):
    options = []
    for key, value in obj.items():
        if type(value) == dict:
            options += obj_to_list(value)
        elif type(value) == list:
            options += value
        else:
            options.append(value)
        options.append(key)
    return options

def check_value_in_list(field, actual_value_type, options, value):
    if actual_value_type == "list":
        for val in value:
            if not val in options:
                raise OptionsException(field, val)
    else:
        if not value in options:
            raise OptionsException(field, value)

def check(schema, data, path):
    print(f"{bcolors.OKBLUE}################################################################################################")   
    print(f"## PROCESSING {bcolors.ENDC}{name}{bcolors.OKBLUE}")     
    print(f"################################################################################################{bcolors.ENDC}")
    error = False
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
                check_value_in_list(field, actual_value_type, options, value)
            
            if "tree" in properties:
                tree = properties["tree"]
                options = obj_to_list(tree)
                check_value_in_list(field, actual_value_type, options, value)

        except Exception as e:
            error = True
            print(f"{bcolors.FAIL}ERROR DETECTED:")
            # print(traceback.format_exc())
            print(str(e) + bcolors.ENDC)
    
    error or print(f"\n{bcolors.OKGREEN}All checks passed!{bcolors.ENDC}")

with open("knowledge/schema.json") as schema_json:
    schema = json.load(schema_json)
    pathlist = Path(".").glob('knowledge/**/data.json')
    for path in pathlist:
        # because path is object not string
        path_in_str = str(path)
        name = path_in_str.replace("data.json", "")
        
        with open(path_in_str) as json_file:
            data = json.load(json_file)
            check(schema, data, path)
            
    
                        
