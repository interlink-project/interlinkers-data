from typing import List, Optional

from problem_profiles import WithProblemProfiles
from pydantic import BaseModel, Extra, validator


class WithNameAndDesc(BaseModel):
    name: dict
    description: dict

    @validator('name', "description")
    def with_languages(cls, v, values, **kwargs):
        if "en" not in v:
            raise ValueError(f'English not detected')
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

    name_translations = {'en': 'Some article'}
