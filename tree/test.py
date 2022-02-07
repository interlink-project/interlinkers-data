import json
from enum import Enum
from typing import List, Literal, Optional, Union

from pydantic import BaseModel, Extra, validator

problem_profiles_ids = []
with open("tree/problem_profiles.json") as json_file:
    for i in json.load(json_file):
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
    objectives: List[Objective]
