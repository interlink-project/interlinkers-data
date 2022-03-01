import json
from pathlib import Path
import os
from slugify import slugify

dicts = {
    "problem_profiles": [],
    "schemas": [],
    "interlinkers": {
        "software": [],
        "knowledge": []
    }
}

with open("problem_profiles.json") as json_file:
    dicts["problem_profiles"] = json.load(json_file)

for schema_metadata_path in Path("./schemas").glob("**/metadata.json"):
    with open(str(schema_metadata_path)) as json_file:

        schema_metadata = json.load(json_file)
        parent = str(schema_metadata_path.parents[0])
        phases = os.listdir(parent + "/phases")

        schema_metadata["phases"] = []
        for phase in phases:
            
            last_phase = "" 
            with open(parent + "/phases/" + phase) as phase_metadata:
                print(parent + "/phases/" + phase)
                phasejson = json.load(phase_metadata)
                
                # if last_phase:
                #     phasejson["prerequisites"] = [{
                #             "phase": last_phase,
                #             "status": "completed"
                #         }]

                last_phase = "phase-" + slugify(phasejson["name_translations"]["en"])
                phasejson["reference"] = last_phase

                last_objective = "" 
                for objs in phasejson["objectives"]:
                    
                    if last_objective:
                        objs["prerequisites"] = [{
                            "objective": last_objective,
                            "status": "completed"
                        }]
                    last_objective = "objective-" +slugify(objs["name_translations"]["en"])
                    objs["reference"] = last_objective
                
                    last_task = "" 
                    for task in objs["tasks"]:
                        
                        if last_task:
                            task["prerequisites"] = [{
                                "objective": last_task,
                                "status": "completed"
                            }]
                        last_task = "objective-" +slugify(task["name_translations"]["en"])
                        task["reference"] = last_task
                schema_metadata["phases"].append(phasejson)
        dicts["schemas"].append(schema_metadata)


# search for schemas
for interlinker_metadata_path in Path("./interlinkers/knowledge").glob("**/metadata.json"):
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        """
        interlinker_metadata["representations"]["en"][0]["name"] = interlinker_metadata["name_translations"]["en"]
        interlinker_metadata["representations"]["en"][0]["extra_tags"] = []
        interlinker_metadata["representations"]["en"][0]["difficulty"] = interlinker_metadata["difficulty"]
        interlinker_metadata["representations"]["en"][0]["extra_targets"] = []
        interlinker_metadata["representations"]["en"][0]["licence"] = interlinker_metadata["licence"]
        interlinker_metadata["representations"]["en"][0]["reference"] = slugify(interlinker_metadata["name_translations"]["en"])
      

        del interlinker_metadata["representations"]["en"][0]["title"]
        del interlinker_metadata["difficulty"]
        del interlinker_metadata["licence"]
        del interlinker_metadata["overview_text"]

        with open(interlinker_metadata_path, "w") as f:
            json.dump(interlinker_metadata, f, indent=4)
        """
        dicts["interlinkers"]["knowledge"].append(interlinker_metadata)

for interlinker_metadata_path in Path("./interlinkers/software").glob("**/metadata.json"):
    with open(str(interlinker_metadata_path)) as json_file:
        interlinker_metadata = json.load(json_file)
        dicts["interlinkers"]["software"].append(interlinker_metadata)

with open(f"all.json", "w") as f:
    json.dump(dicts, f, indent=4)
