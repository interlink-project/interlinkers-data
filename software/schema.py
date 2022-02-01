import json
from enum import Enum
from pathlib import Path

from base import InterlinkerSchema
from pydantic import FilePath, HttpUrl
from typing import Optional, Union

parent = Path(__file__).parents[0]

class Supporters(Enum):
    saas = "saas"
    op = "on_premise"
    installed = "installed_app"
    
class AuthMethods(Enum):
    header = "header"
    cookie = "cookie"


class Schema(InterlinkerSchema):
    supported_by: Supporters
    auth_method: AuthMethods
    deployment_manual: Optional[Union[HttpUrl, FilePath]]
    user_manual: Optional[Union[HttpUrl, FilePath]]
    developer_manual: Optional[Union[HttpUrl, FilePath]]

    supports_internationalization: bool
    
    is_responsive: bool
    # GUI is responsive
    open_in_modal: bool
    # assets for specific interlinkers may be opened on a modal, not in a new tab
    assets_clonable: bool
    # exposes an /assets/{id}/clone/ API endpoint?

    path: str
    is_subdomain: bool
    logotype: FilePath
    # if is_subdomain == true:
    #   https://{path}.dev.interlink-project.eu
    #   for example loomio
    # else:
    #   https://dev.interlink-project.eu/{path}
    #   for example googledrive or survey
