from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any, Optional
from datetime import date

class ContactInfo(BaseModel):
    description: Optional[str]
    emailDescription: Optional[str]
    email: Optional[str]
    name: Optional[str]
    phoneNumber: Optional[str]

class Eligibility(BaseModel):
    activities: List[str]
    applicants: List[str]

class CompanyInfo(BaseModel):
    id: int
    agency: str
    logo: HttpUrl
    applicationDueDate: date
    shortDescription: str
    description: str
    categories: List[str]
    contactInformation: ContactInfo
    eligibility: Eligibility
    estimatedAwardDate: date
    fundingAmount: str
    fundingTypes: List[str]
    howToApply: str
    website: HttpUrl
    locations: List[str]
    matchRequired: bool
    openDate: date
    otherCategory: str
    status: str
    title: str
    totalProgramFunding: str

class UserInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    # add other fields you expect

class SubmissionInput(BaseModel):
    user_info: UserInfo
    company_info: CompanyInfo
    url: HttpUrl