from enum import Enum
from typing import Dict, Union

from interlinkers.base import Difficulties, InterlinkerSchema, Licences
from pydantic import FilePath, HttpUrl, conlist


class FormTypes(Enum):
    visual_template = "visual_template"
    document_template = "document_template"
    canvas = "canvas"
    best_practices = "best_practices"
    guidelines = "guidelines"
    checklist = "checklist"
    survey_template = "survey_template"
    legal_agreement_template = "legal_agreement_template"
    other = "other"


class Formats(Enum):
    pdf = "pdf"
    editable_source_document = "editable_source_document"
    open_document = "open_document"
    structured_format = "structured_format"


class SoftwareInterlinkers(Enum):
    googledrive = "googledrive"
    survey = "survey"
    ceditor = "ceditor"
    externalresourcemanager = "externalresourcemanager"


class Schema(InterlinkerSchema):
    difficulty: str
    licence: str
    instructions_translations:  Dict[str,  Union[HttpUrl, FilePath]]
    # language: str
    form: FormTypes
    # FOR 1
    # Type of knowledge INTERLINKER: e.g., visual template, document template, canvas, best practices, guidelines, checklist, survey template, legal agreement template
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER

    format: Formats
    # FOR 1 // COULD BE INFERED
    # Type of the format used to encode the knowledge of the INTERLINKER
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER
    softwareinterlinker: SoftwareInterlinkers
    file_translations:  Dict[str,  FilePath]

    difficulty: Difficulties
    licence: Licences
