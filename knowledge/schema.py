from datetime import datetime
from enum import Enum
from typing import List, Optional, Any
from pydantic import BaseModel
from pydantic import BaseModel, ValidationError, validator
from pathlib import Path
import json

# https://docs.google.com/spreadsheets/d/1tJ2BfX4EOdbBqEbrJWg8a3MENw13vYiPZM_S4wWWgWQ/edit#gid=0

parent = Path(__file__).parents[0]

class Difficulties(Enum):
    very_easy = 'very_easy'
    easy = 'easy'
    medium = 'medium'
    difficult = 'difficult'
    very_difficult = 'very_difficult'

class Targets(Enum):
    all = "all"
    pas = "all;pas"
    public_servants = "all;pas;public_servants"
    politicians = "all;pas;politicians"
    businesses = "all;businesses"
    smes = "all;businesses;smes"
    freelancers = "all;businesses;freelancers"
    large_companies = "all;businesses;large_companies"
    private_non_profit = "all;businesses;private_non_profit"
    citizens = "all;citizens"
    potential_end_users = "all;citizens;potential_end_users"
    expert_citizens = "all;citizens;expert_citizens"
    research_organizations = "all;research_organizations"
    universities = "all;research_organizations;universities"
    other_research_entities = "all;research_organizations;other_research_entities"

class ProblemProfiles(str):
    pass

class Schema(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[List[str]]
    tasks: Optional[List[str]]
    keywords: str
    difficulty: Difficulties
    targets: List[Targets]
    file: str

    whyToUseIt: Optional[str]
    problemProfiles: List[ProblemProfiles]
    
    @validator('keywords')
    def keywords_length(cls, v):
        minimum = 1
        if len(v.split(";")) < 1:
            raise ValueError(f'minimum keywords: {minimum}')
        return v
    
    @validator('file')
    def file_exists(cls, v):
        file = Path(str(parent) + "/" + v)
        if file.is_file():
            return v
        raise ValueError(f'{file} does not exist. Remember: example_knowledge_interlinker/resources/doc.docx')



################################################
## Create JSON schema from pydantic Schema
################################################

with open(f'{parent}/schema.json', 'w') as f:
    json.dump(Schema.schema(), f, indent=4)