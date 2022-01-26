from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, conlist, Extra

# https://docs.google.com/spreadsheets/d/1tJ2BfX4EOdbBqEbrJWg8a3MENw13vYiPZM_S4wWWgWQ/edit#gid=0


class Difficulties(Enum):
    very_easy = "very_easy"
    easy = "easy"
    medium = "medium"
    difficult = "difficult"
    very_difficult = "very_difficult"


class Licences(Enum):
    public_domain = "public_domain"
    permissive = "permissive"
    copyleft = "copyleft"
    non_commercial = "non_commercial"
    propietary = "propietary"


class Targets(Enum):
    all = "all"
    pas = "all;pas"
    public_servants = "all;pas;public_servants"
    politicians = "all;pas;politicians"
    businesses = "all;businesses"
    smes = "all;businesses;smes"
    freelancers = "all;businesses;freelancers"
    large_companies = "all;businesses;large_companies"
    private_non_profit = "all;businesses;private_non_profit"
    citizens = "all;citizens"
    potential_end_users = "all;citizens;potential_end_users"
    expert_citizens = "all;citizens;expert_citizens"
    research_organizations = "all;research_organizations"
    universities = "all;research_organizations;universities"
    other_research_entities = "all;research_organizations;other_research_entities"


class ProblemProfiles(str):
    pass


class InterlinkerTypes(Enum):
    enabling = "enabling_services"
    implementation = "enabling_services;implementing_software_and_artifacts"
    operation = "enabling_services;operation_services"
    enhancing = "enhancing_services"
    onboarding = "enhancing_services;onboarding_services"
    followup = "enhancing_services;followup_services"
    external = "enhancing_services:external_experts"


class AdministrativeScopes(Enum):
    eu = "eu"
    national = "national"
    local = "local"


class InterlinkerSchema(BaseModel, extra=Extra.forbid):
    name: str
    # FOR 1
    # A name for the INTERLINKER.
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER
    # - Used for searching/browsing the catalogue of INTERLINKERS by name

    description: str
    # FOR 1
    # Textual description of the INTERLINKER, its functionality, usage, etc.
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER

    tags: conlist(str, min_items=1)
    # FOR 1
    # Tags that can be used to characterize the INTERLINKER

    difficulty: Difficulties
    # FOR 1
    # Level of difficulty in using the tool

    targets: Optional[List[Targets]]
    # FOR 2
    # List of stakeholders, if applicable, that will be engaged in using this INTERLINKER.

    licence: Licences
    # FOR 1
    # Type of licences under which the INTERLINKER is usable.
    # The user should be provided with information that explains the meaning of the different licences, both for software and knowledge.

    whyToUseIt: Optional[str]
    # FOR 1
    # Textual field explaining in a clear way which is the problem that this INTERLINKER helps to address, i.e. when the enabler should be used.
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER

    problemProfiles: List[ProblemProfiles]
    # FOR 1
    # List of names of Problem Profiles associated to the INTERLINKER
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER
    # - Used by the Wizard algorithms for intelligent filtering and recommendation

    types: Optional[List[InterlinkerTypes]]
    # FOR 2
    # Either Enabling or Enhancing Service with the corresponding sub-classification.
    # This input will be:
    # - Used internally by the INTERLINK platform to describe how the INTERLINKER relates to the standard classifications introduced by the CEF Service Offering Canvas (SOC)

    related_interlinkers: Optional[List[str]]
    # FOR 1
    # List of related INTERLINKERS and dependency INTERLINKERS.
    # This input will be:
    # - Shown on the platform interface in the page showing the details of the INTERLINKER
    # - Used by the Wizard algorithms for intelligent filtering and recommendation

    admistrative_scope: Optional[List[AdministrativeScopes]]
    # FOR 2
    # This field describes the administrative context for which this INTERLINKER is particularly suitable.
    # Multiple values are possible:

    domain: Optional[str]
    # FOR 2
    # This field describes the Public Service application domain for which this INTERLINKER is particularly suitable.
    # Possible values should be taken from standard classifications of public services. (For example the Core Public Service Vocabulary Application Profile (CPSV-AP) developed within the ISA2 European initiative).

    process: Optional[str]
    # FOR 2
    # This field describes the governance model for which the INTERLINKER is particularly suitable.

    constraints_and_limitations: str
    # FOR 1
    # Specific requirements and properties constraining the usage and exploitation of the INTERLINKER
    # This input will be:
    # - Shown to technical users of the platform to explain how the INTERLINKER can be used as a Building Block for Public Services
    # - (To be decided) Shown on the platform interface in the page showing the details of the INTERLINKER
    # - (To be decided) Used by the Wizard algorithms for intelligent filtering and recommendation

    regulations_and_standards: Optional[str]
    # FOR 1
    # Legal and technical context where the INTERLINKER operates, as a set of relevant, normative acts, policies, standards, and specification the INTERLINKER adheres to.
    # This input will be:
    # - Shown to technical users of the platform to explain how the INTERLINKER adheres to national and EU standards
    # - (To be decided) Shown on the platform interface in the page showing the details of the INTERLINKER
    # - (To be decided) Used by the Wizard algorithms for intelligent filtering and recommendation
    #
    # Possible values:
    # In the initial specification of INTERLINKERS this field will be defined as textual, to allow for more freedom in the description.
    # To be further evaluated which types of standard classifications will be used as reference for a more constrained filling of this field.

    overview_text: Optional[str]
    # FOR 2
    # Explanation of what is made available for user interaction.