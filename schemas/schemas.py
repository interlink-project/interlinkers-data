from typing import List, Optional, Dict

from problem_profiles import WithProblemProfiles
from pydantic import BaseModel, Extra, validator


class WithNameAndDesc(BaseModel):
    name_translations: dict
    description_translations: dict

    @validator('name_translations', "description_translations")
    def with_languages(cls, v, values, **kwargs):
        if "en" not in v:
            raise ValueError(f'English not detected')
        return v


class Task(WithProblemProfiles, WithNameAndDesc, extra=Extra.forbid):
    pass


class Objective(WithProblemProfiles, WithNameAndDesc, extra=Extra.forbid):
    tasks: List[Task]


class Phase(WithNameAndDesc, extra=Extra.forbid):
    reference: str
    prerequisites: Dict[str, str]
    objectives: List[Objective]


class CoproductionSchema(WithNameAndDesc, extra=Extra.forbid):
    reference: str
    tags: List[str]
    author: str
    licence: Optional[str]
