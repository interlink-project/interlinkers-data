import json
from enum import Enum
from pathlib import Path

from base import InterlinkerSchema
from pydantic import validator
from typing import Optional

parent = Path(__file__).parents[0]

class Supporters(Enum):
    saas = "saas"
    op = "on_premise"
    installed = "installed_app"
    
class Schema(InterlinkerSchema):
    supported_by: Supporters
    deployment_readme: Optional[str]
    
    path: str
    is_subdomain: bool
    user_manual: Optional[str]
    developer_manual: Optional[str]