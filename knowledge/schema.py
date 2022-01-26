import json
from enum import Enum
from pathlib import Path

from base import InterlinkerSchema
from pydantic import validator

# https://docs.google.com/spreadsheets/d/1tJ2BfX4EOdbBqEbrJWg8a3MENw13vYiPZM_S4wWWgWQ/edit#gid=0

parent = Path(__file__).parents[0]


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


class Schema(InterlinkerSchema):
    file: str

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

    instructions: str
    # FOR 1
    # HTML for the instructions

    @validator("file")
    def file_exists(cls, v):
        file = Path(str(parent) + "/" + v)
        if not file.is_file():
            raise ValueError(
                f"{file} does not exist. Example: example_knowledge_interlinker/resources/doc.docx"
            )
        return v
