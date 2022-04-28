import json
from pathlib import Path
import os
import shutil
from slugify import slugify

weblate_interlinkers = {
"en": {},
"es": {},
"it": {},
"lv": {}
}
weblate_problemprofiles = {
"en": {},
"es": {},
"it": {},
"lv": {}
}
weblate_schemas = {
"en": {},
"es": {},
"it": {},
"lv": {}
}

DELIMITER = ";"

def add_to_weblate(key: str, obj: dict, data: dict):
    translatable_elements = ["name_translations", "description_translations"]
    for lang_code in data.get("languages", ["en", "es", "it", "lv"]):
        for element in translatable_elements:
            if element in data:
                ref = data.get("id", "").lower()
                addon = element.replace("_translations", "")
                obj[lang_code][key + DELIMITER + ref + DELIMITER + addon] = data[element].get(lang_code, "")

dicts = {
    "problemprofiles": [],
    "schemas": [],
    "interlinkers": {
        "software": [],
        "knowledge": [],
        "external": []
    }
}

with open("./problemprofiles/problemprofiles.json") as json_file:
    problemprofiles = json.load(json_file)
    dicts["problemprofiles"] = problemprofiles
    for pp in problemprofiles:
        add_to_weblate("problemprofile", weblate_problemprofiles, pp)

for schema_metadata_path in Path("./schemas").glob("**/metadata.json"):
    with open(str(schema_metadata_path)) as json_file:

        schema_metadata = json.load(json_file)
        parent = str(schema_metadata_path.parents[0])
        phases = os.listdir(parent + "/phases")

        schema_metadata["phases"] = []
        for phase_name in phases:
            
            last_phase = "" 
            with open(parent + "/phases/" + phase_name) as phasefile:
                print(parent + "/phases/" + phase_name)
                phase = json.load(phasefile)

                last_objective = "" 
                for objective in phase["objectives"]:
                    
                    if last_objective:
                        objective["prerequisites"] = [{
                            "item": last_objective,
                            "status": "completed"
                        }]
                    last_objective = "objective-" + slugify(objective["name_translations"]["en"])
                    objective["id"] = last_objective
                    
                    last_task = "" 
                    for task in objective["tasks"]:
                        
                        if last_task:
                            task["prerequisites"] = [{
                                "item": last_task,
                                "status": "completed"
                            }]
                        last_task = slugify(task["name_translations"]["en"])
                        task["id"] = "task-" + last_task
                        add_to_weblate(schema_metadata["id"] +  DELIMITER  + phase["id"] +  DELIMITER + objective["id"], weblate_schemas, task)
                    add_to_weblate(schema_metadata["id"] +  DELIMITER  + phase["id"], weblate_schemas, objective)
                schema_metadata["phases"].append(phase)
                add_to_weblate(schema_metadata["id"], weblate_schemas, phase)
        dicts["schemas"].append(schema_metadata)
        add_to_weblate("schema", weblate_schemas, schema_metadata)



ids = []
for interlinker_metadata_path in Path("./interlinkers").glob("**/metadata.json"):
    # set ids of interlinkers are slugified and lowered
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        id = slugify(interlinker_metadata["name_translations"]["en"]).lower()
        while id in ids:
            id += "-2"
        interlinker_metadata["id"] = id
       
for interlinker_metadata_path in Path("./interlinkers/knowledge").glob("**/metadata.json"):
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        add_to_weblate("knowledgeinterlinker", weblate_interlinkers, interlinker_metadata)
        dicts["interlinkers"]["knowledge"].append(interlinker_metadata)

for interlinker_metadata_path in Path("./interlinkers/software").glob("**/metadata.json"):
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        add_to_weblate("softwareinterlinker", weblate_interlinkers, interlinker_metadata)
        dicts["interlinkers"]["software"].append(interlinker_metadata)

for interlinker_metadata_path in Path("./interlinkers/externalsoftware").glob("**/metadata.json"):
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        interlinker_metadata["type"] = "software"
        add_to_weblate("externalsoftware", weblate_interlinkers, interlinker_metadata)
        dicts["interlinkers"]["external"].append(interlinker_metadata)

for interlinker_metadata_path in Path("./interlinkers/externalknowledge").glob("**/metadata.json"):
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        interlinker_metadata["type"] = "knowledge"
        add_to_weblate("externalknowledge", weblate_interlinkers, interlinker_metadata)
        dicts["interlinkers"]["external"].append(interlinker_metadata)

with open(f"all.json", "w") as f:
    json.dump(dicts, f, indent=4)

for lang_key, data in weblate_interlinkers.items():
    with open(f"./weblate/{lang_key}/interlinkers.json", "w") as f:
        json.dump(data, f, indent=4)

for lang_key, data in weblate_problemprofiles.items():
    with open(f"./weblate/{lang_key}/problemprofiles.json", "w") as f:
        json.dump(data, f, indent=4)
    
for lang_key, data in weblate_schemas.items():
    with open(f"./weblate/{lang_key}/schemas.json", "w") as f:
        json.dump(data, f, indent=4)