import json
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Constants
AGENCIES = [
    "U.S. Agency for International Development (USAID)",
    "National Institutes of Health (NIH)",
    "Department of Education",
    "National Science Foundation (NSF)",
    "Department of Agriculture (USDA)",
    "Department of Energy (DOE)"
]

CATEGORIES = [
    "Health & Human Services", "Education", "Science and Technology",
    "Environment", "Energy", "Community Development", "Arts and Culture"
]

FUNDING_TYPES = ["Cooperative Agreement", "Grant", "Contract", "Other"]

LOCATIONS = [
    "Federal", "International", "California", "New York", "Texas",
    "Florida", "Illinois", "Washington", "Colorado", "Ohio"
]

STATUS_OPTIONS = ["Posted", "Forecasted", "Rolling", "Closed", "Archived"]

APPLICANTS = [
    "Unrestricted", "Nonprofits", "For-profit organizations",
    "Public housing authorities", "State governments", "Private institutions"
]

ACTIVITIES = ["Research and Development", "Training", "Technical Assistance"]

def random_date(start_year=2020, end_year=2030):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return fake.date_between(start_date=start, end_date=end).isoformat() + "T00:00:00.000Z"

def generate_grant(id):
    return {
        "id": id,
        "agency": random.choice(AGENCIES),
        "applicationDueDate": random_date(),
        "categories": [random.choice(CATEGORIES)],
        "contactInformation": {
            "description": None,
            "emailDescription": fake.job(),
            "email": fake.email(),
            "name": None,
            "phoneNumber": None
        },
        "description": fake.paragraph(nb_sentences=3),
        "eligibility": {
            "activities": [random.choice(ACTIVITIES)],
            "applicants": [random.choice(APPLICANTS)]
        },
        "estimatedAwardDate": random.choice([random_date(), None]),
        "fundingAmount": random.choice([str(random.randint(10000, 1000000)), None, "0"]),
        "fundingTypes": random.sample(FUNDING_TYPES, k=random.randint(1, 2)),
        "howToApply": fake.paragraph(nb_sentences=2),
        "website": fake.url(),
        "locations": random.sample(LOCATIONS, k=random.randint(1, 3)),
        "matchRequired": random.choice([True, False]),
        "openDate": random_date(),
        "otherCategory": random.choice(CATEGORIES),
        "status": random.choice(STATUS_OPTIONS),
        "title": fake.sentence(nb_words=6).rstrip("."),
        "totalProgramFunding": random.choice([str(random.randint(50000, 5000000)), None, "0"]),
    }

# Generate 100 grants
grants = [generate_grant(i + 1) for i in range(100)]

# Write to file
with open("fake_grants.json", "w") as f:
    json.dump(grants, f, indent=2)

print("✅ Generated 100 fake grant records in fake_grants.json")