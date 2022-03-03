import json
from enum import Enum
from pathlib import Path

from interlinkers.base import InterlinkerSchema, Difficulties, Licences
from pydantic import FilePath, HttpUrl, BaseModel, conlist, validator

from typing import Optional, Union, List, Dict

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
    clone: bool
    edit: bool
    delete: bool
    open_in_modal: bool
    shortcut: bool

class CapabilitiesTranslations(BaseModel):
    instantiate: Optional[Dict[str, str]]
    view: Optional[Dict[str, str]]
    clone: Optional[Dict[str, str]]
    edit: Optional[Dict[str, str]]
    delete: Optional[Dict[str, str]]

class Integration(BaseModel):
    service_name: str
    domain: str
    path: str
    is_subdomain: bool
    api_path: str
    capabilities: Capabilities
    capabilities_translations: CapabilitiesTranslations
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

    # INTERLINKER SPECIFIC
    difficulty: Difficulties
    # FOR 1
    # Level of difficulty in using the tool

    licence: Licences
    # FOR 1
    # Type of licences under which the INTERLINKER is usable.
    # The user should be provided with information that explains the meaning of the different licences, both for software and knowledge.
