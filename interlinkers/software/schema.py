import json
from enum import Enum
from pathlib import Path

from interlinkers.base import InterlinkerSchema
from pydantic import FilePath, HttpUrl, BaseModel
from typing import Optional, Union, List

parent = Path(__file__).parents[0]

class Supporters(Enum):
    saas = "saas"
    op = "on_premise"
    installed = "installed_app"
    
class AuthMethods(Enum):
    header = "header"
    cookie = "cookie"


class Capabilities(BaseModel):
    instantiate: bool
    view: bool
    edit: bool
    delete: bool
    open_in_modal: bool

class Integration(BaseModel):
    service_name: str
    domain: str
    path: str
    is_subdomain: bool
    api_path: str
    capabilities: Capabilities
    auth_method: AuthMethods

class Schema(InterlinkerSchema):
    logotype: Optional[FilePath]

    supported_by: List[Supporters]
    
    deployment_manual: Optional[Union[HttpUrl, FilePath]]
    user_manual: Optional[Union[HttpUrl, FilePath]]
    developer_manual: Optional[Union[HttpUrl, FilePath]]

    supports_internationalization: bool
    is_responsive: bool
    
    integration: Optional[Integration] 
    
    