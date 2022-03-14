import json
from enum import Enum
from pathlib import Path

from interlinkers.base import InterlinkerSchema, Difficulties, Licences
from pydantic import FilePath, HttpUrl, BaseModel, Field
from typing_extensions import Annotated

from typing import Literal, Optional, Union, List, Dict

parent = Path(__file__).parents[0]


class Supporters(Enum):
    saas = "saas"
    op = "on_premise"
    installed = "installed_app"


class AuthMethods(Enum):
    header = "header"
    cookie = "cookie"

class IntegrationTypes(Enum):
    internal = "internalintegration"
    external = "externalintegration"

class Capabilities(BaseModel):
    instantiate: bool
    view: bool
    clone: bool
    edit: bool
    delete: bool
    download: bool
    open_in_modal: bool
    shortcut: bool

class CapabilitiesTranslations(BaseModel):
    instantiate_text_translations: Optional[Dict[str, str]]
    view_text_translations: Optional[Dict[str, str]]
    clone_text_translations: Optional[Dict[str, str]]
    edit_text_translations: Optional[Dict[str, str]]
    delete_text_translations: Optional[Dict[str, str]]
    download_text_translations: Optional[Dict[str, str]]

class InternalIntegration(BaseModel):
    type: IntegrationTypes
    service_name: str
    domain: str
    path: str
    is_subdomain: bool
    api_path: str
    capabilities: Capabilities
    capabilities_translations: CapabilitiesTranslations
    auth_method: AuthMethods

class ExternalIntegration(BaseModel):
    type: IntegrationTypes
    redirection: str
    result: Optional[str]

class Schema(InterlinkerSchema):
    logotype: Optional[FilePath]

    supported_by: List[Supporters]

    deployment_manual: Optional[Union[HttpUrl, FilePath]]
    user_manual: Optional[Union[HttpUrl, FilePath]]
    developer_manual: Optional[Union[HttpUrl, FilePath]]

    supports_internationalization: bool
    is_responsive: bool

    integration: Union[InternalIntegration, ExternalIntegration]

    # INTERLINKER SPECIFIC
    difficulty: Difficulties
    # FOR 1
    # Level of difficulty in using the tool

    licence: Licences
    # FOR 1
    # Type of licences under which the INTERLINKER is usable.
    # The user should be provided with information that explains the meaning of the different licences, both for software and knowledge.
