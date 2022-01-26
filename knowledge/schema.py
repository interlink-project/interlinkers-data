from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel
from pydantic import BaseModel, ValidationError, validator

class Difficulties(Enum):
    easy = 'easy'
    difficult = 'difficult'

class Schema(BaseModel):
    name: str
    description: Optional[str] = None
    keywords: str
    difficulty: Difficulties

    @validator('keywords')
    def keywords_length(cls, v):
        minimum = 1
        if len(v.split(";")) < 1:
            raise ValueError(f'minimum keywords: {minimum}')
        return v