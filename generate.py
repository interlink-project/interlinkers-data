import json
from pathlib import Path
import os
import shutil
from slugify import slugify

lang_keys = ["en", "es", "it", "lv"]
weblate_interlinkers = {}
weblate_problemprofiles = {}
weblate_schemas = {}

for lang_key in lang_keys:
    weblate_schemas[lang_key] = {}
    weblate_problemprofiles[lang_key] = {}
    weblate_interlinkers[lang_key] = {}
    


DELIMITER = ";"

def add_to_weblate(key: str, obj: dict, data: dict):
    for lang_code in data.get("languages", ["en", "es", "it", "lv"]):
        ref = data.get("id", "").lower()
        for translatable_element in ["name_translations", "description_translations"]:
            if translatable_element in data:
                addon = translatable_element.replace("_translations", "")
                key = key + DELIMITER + ref + DELIMITER + addon
                value = data[translatable_element].get(lang_code, "")
                
                obj[lang_code][key] = value
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
                        last_task = "task-" + slugify(task["name_translations"]["en"])
                        task["id"] = last_task
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
    json.dump(dicts, f, indent=4, sort_keys=True)

def export(obj, file):
    for lang_key, data in obj.items():
        with open(f"./weblate/{lang_key}/{file}", "w") as f:
            json.dump(data, f, indent=4, sort_keys=True)

export(weblate_interlinkers, "interlinkers.json")
export(weblate_problemprofiles, "problemprofiles.json")
export(weblate_schemas, "schemas.json")