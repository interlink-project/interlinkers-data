# Interlinkers data

In here we will indicate the steps to follow to create a BUNDLE for a KNOWLEDGE INTERLINKER that can be imported directly by the INTERLINKER catalogue

## Basic directory tree

```
.
|-- ./knowledge
|   |-- ./knowledge/example_knowledge_interlinker
|   |   |-- ./knowledge/example_knowledge_interlinker/snapshots
|   |   |-- ./knowledge/example_knowledge_interlinker/doc.docx
|   |   `-- ./knowledge/example_knowledge_interlinker/metadata.json
|   `-- ./knowledge/schema.py
|-- base.py
`-- test.py    
```

## For users
The way to add new interlinkers is to create a new directory that follows the structure defined by the example.
 
The only mandatory element is the existence of the "metadata.json" file in the root of the directory.

Optionally, a directory called "snapshots" can be created to store the images corresponding to the interlinker.

In the case of adding a new knowledge interlinker, the following sections must be included in the metadata.json:

```yaml
{
    "name":                         free text
    "description":                  free text
    "tags":                         array of free text
    "difficulty":                   "very_easy", "easy", "medium", "difficult" or "very_difficult"
    "licence":                      "propietary"
    "whyToUseIt":                   free text
    "problemProfiles":              array of free text
    "related_interlinkers":         array of free text
    "constraints_and_limitations":  free text
    "regulations_and_standards":    optional text
    "form":                         "visual_template",
    "format":                       "editable_source_document",
    "instructions":                 free text
    "file":                         valid path to file
}
```

For example:
```json
{
    "name": "Example knowledge interlinker",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus sapien, dapibus fringilla dolor sit amet, bibendum aliquam massa. Duis nec faucibus nunc. In sit amet vulputate justo. In dictum turpis eu dolor posuere vehicula.",
    "tags": [
        "skeleton",
        "aim",
        "project"
    ],
    "difficulty": "easy",
    "licence": "propietary",
    "whyToUseIt": "",
    "problemProfiles": [
        "example"
    ],
    "related_interlinkers": [],
    "constraints_and_limitations": "Some text here",
    "regulations_and_standards": "Optional text here",
    "form": "visual_template",
    "format": "editable_source_document",
    "instructions": "<h2 class=\"fg-white\">",
    "file": "example_knowledge_interlinker/doc.docx"
}
```

## For developers

### How can I extend / modify the current schema?

#### What is pydantic?

Take a look pydantic field types: https://pydantic-docs.helpmanual.io/usage/types/

#### Base interlinker schema

This scheme defines the common properties for software and knowledge interlinkers. It is located in the root of the repository with the name of "base.py".

./base.py

Defines these attributes:

* name
* description
* tags
* difficulty
* targets
* whyToUseIt
* problemProfiles
* types
* related_interlinkers
* administrative_scope
* domain
* process
* constraints_and_limitations
* regulations_and_standards
* overview_text

(Some of them are not required for the first phase, so are marked as optional)

#### Knowledge interlinker schema

/knowledge/schema.py

Extends the base with these attributes:
* file
* form
* format

### Testing

```python
pip3 install pydantic
python3 test.py
```