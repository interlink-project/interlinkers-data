from pydantic import BaseModel, validator
import json
from colors import bcolors


class ProblemProfile(BaseModel):
    id: str
    name: dict
    description: dict
    functionality: dict


problem_profiles_ids = []
with open("problem_profiles.json") as json_file:
    for i in json.load(json_file):
        ProblemProfile(**i)
        problem_profiles_ids.append(i["id"])

class WithProblemProfiles(BaseModel):
    problem_profiles: list

    @validator('problem_profiles')
    def problem_profiles_valid(cls, v, values, **kwargs):
        if len(v) == 0:
            print(
                f"{bcolors.WARNING} ## WARNING Problem profiles empty {values}{bcolors.ENDC}"
            ) 
        for id in v:
            if id not in problem_profiles_ids:
                raise ValueError(f'Invalid problem profile id {id}')
        return v
