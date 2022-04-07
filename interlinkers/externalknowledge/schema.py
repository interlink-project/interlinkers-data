import json
from enum import Enum
from pathlib import Path

from interlinkers.base import InterlinkerSchema, Difficulties, Licences
from pydantic import FilePath, HttpUrl, BaseModel, Field
from typing_extensions import Annotated

from typing import Literal, Optional, Union, List, Dict

parent = Path(__file__).parents[0]

class Schema(InterlinkerSchema):
    logotype: Optional[FilePath]
    
    deployment_manual: Optional[Union[HttpUrl, FilePath]]
    user_manual: Optional[Union[HttpUrl, FilePath]]
    developer_manual: Optional[Union[HttpUrl, FilePath]]

    uri_translations: dict
    asset_name_translations: Optional[dict]