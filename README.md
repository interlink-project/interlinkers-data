# Interlinkers data

In here we will indicate the steps to follow to create a BUNDLE for a KNOWLEDGE INTERLINKER that can be imported directly by the INTERLINKER catalogue


# For users
The way to add new interlinkers is to create a new directory that follows the structure defined by the example.
 
The only mandatory element is the existence of the "metadata.json" file in the root of the directory.

Optionally, a directory called "snapshots" can be created to store the images corresponding to the interlinker.

```
├── base.py
├── knowledge
│   ├── example_knowledge_interlinker
│   │   ├── doc.docx
│   │   ├── metadata.json
│   │   └── snapshots
│   │       ├── image1.jpeg
│   │       └── image2.jpeg
│   ├── schema.json
│   └── schema.py
└── test.py
```

## Adding new interlinker

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

## How to validate data

Enter
https://www.jsonschemavalidator.net/


If you want to check metadata for a knowledge interlinker, open /knowledge/schema.json file and copy its content into the left part. Now, copy the metadata.json into the right part.

![correct](images/correct.png)

Incorrect metadata.json (tags length < 1)

![incorrect](images/incorrect.png)

# For developers


## What is pydantic?

Pydantic is a useful library for data parsing and validation. It coerces input types to the declared type (using type hints), accumulates all the errors using ValidationError & it’s also well documented making it easily discoverable.

### Basic examples
```yaml
Free text:               str
Whole number:            int
Decimal:                 float
Boolean:                 bool
Optional text:           Optional[str]
List of texts:           List[str]
Optional array of texts: Optional[List[str]]
```

```py
class Schema(BaseModel):
    name: str
    description: Optional[str]
    tags: List[str]
```

### Enumerations

```py
class Difficulties(Enum):
    very_easy = "very_easy"
    easy = "easy"
    medium = "medium"
    difficult = "difficult"
    very_difficult = "very_difficult"

class Schema(BaseModel):
    difficulty: Difficulties
```

Now difficulty can only be one of the values specified in the enum

### Conditionals:

conbytes, condecimal, confloat, conint, conlist, conset, constr

```py
class Schema(BaseModel):
    tags: conlist(str, min_items=1)
```

### Custom validators

Override a validator for a given attribute. For example, you can validate that the path contained in the file attribute is actually a file:

```py
class Schema(BaseModel):
    file: str

    @validator("file")
    def file_exists(cls, v):
        file = Path(str(parent) + "/" + v)
        if not file.is_file():
            raise ValueError(
                f"{file} does not exist. Example: example_knowledge_interlinker/resources/doc.docx"
            )
        return v

```

### Nested objects

```py
class File(BaseModel):
    name: str
    path: str
    thumbnail: str

class Schema(BaseModel):
    name: str
    file: File
    
```

```json
{
    "name": "example",
    "file": {
        "name": "filename",
        "path": "/home/doc.docx",
        "thumbnail": "/home/logo.png"
    }
}
```

### How to validate data
```py
data = {
    "name": "...",
    "description": "...",
    "tags": [ ... ],
    ...
}

Schema(**data)
# if not valid, raises exception
```


### Extra attributes forbidden 

If the schema is instantiated with more attributes than specified in it, it fails

```py
from pydantic import BaseModel, Extra

data = {
    "name": "example",
    "description": "description",
    "image": "image"
}
class InterlinkerSchema(BaseModel, extra=Extra.forbid):
    name: str
    description: str

InterlinkerSchema(**data)

```
Raises:
```
pydantic.error_wrappers.ValidationError: 1 validation error for InterlinkerSchema
image
  extra fields not permitted (type=value_error.extra)
```

> Take a look at pydantic documentation for more field types: https://pydantic-docs.helpmanual.io/usage/types/


## Interlinker schemas

### Base interlinker schema

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

### Knowledge interlinker schema

/knowledge/schema.py

Extends the base with these attributes:
* file
* form
* format

## Testing

To test that all the interlinkers (directories) and their metadata are valid, a script called "test.py" is provided, which in addition to validating the metadata, creates a file "schema.json" at the height of "schema.py" that users can use to quickly validate if the metadata is correct, without having to use python at all, as can be seen in "For users" section.

#### Install the dependencies:
```sh
pip3 install pydantic
```

#### Run the script:
```sh
python3 test.py
```

### Github action to test on versions push

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: checkout repo content
        uses: actions/checkout@v2 # checkout the repository content to github runner.
      - name: setup python
        uses: actions/setup-python@v2
        with:
          python-version: 3.8 #install the python needed
      - name: Install dependencies and run test script
        run: |
          python -m pip install --upgrade pip
          pip3 install pydantic
          python test.py
```