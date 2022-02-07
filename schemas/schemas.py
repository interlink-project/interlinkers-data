import json
from typing import List, Optional

from pydantic import BaseModel, Extra, validator


class ProblemProfile(BaseModel):
    id: str
    name_en: str
    description_en: str
    functionality_en: str


problem_profiles_ids = []
with open("schemas/problem_profiles.json") as json_file:
    for i in json.load(json_file):
        ProblemProfile(**i)
        problem_profiles_ids.append(i["id"])


class WithNameAndDesc(BaseModel):
    name: list
    description: list

    @validator('name', "description")
    def with_languages(cls, v, values, **kwargs):
        for obj in v:
            if "locale" not in obj or "value" not in obj:
                raise ValueError(f'Invalid languages')
        return v


class WithProblemProfiles(BaseModel):
    problem_profiles: list

    @validator('problem_profiles')
    def problem_profiles_valid(cls, v, values, **kwargs):
        for id in v:
            if id not in problem_profiles_ids:
                raise ValueError(f'Invalid problem profile id {id}')
        return v


class Task(WithProblemProfiles, WithNameAndDesc, extra=Extra.forbid):
    pass


class Objective(WithProblemProfiles, WithNameAndDesc, extra=Extra.forbid):
    tasks: List[Task]


class Phase(WithNameAndDesc, extra=Extra.forbid):
    prerequisites: list
    objectives: List[Objective]

class CoproductionSchema(WithNameAndDesc, extra=Extra.forbid):
    author: str
    licence: Optional[str]
