from enum import Enum

class Languages(Enum):
    es = "es"
    en = "en"
    lv = "lv"
    it = "it"

lang_keys = [e.value for e in Languages]
