import random
import json
from faker import Faker

fake = Faker()

form_base_url = "https://kevinrichard1.github.io/CCIHackathon2025/index.html"

funding_orgs = [
    {
        "id": "org001",
        "name": "Health & Research Foundation",
        "sector": "Health & Human Services",
        "domain": "https://healthresearch.org",
    },
    {
        "id": "org002",
        "name": "Arts & Culture Trust",
        "sector": "Arts & Culture",
        "domain": "https://artsandculturetrust.org",
    },
    {
        "id": "org003",
        "name": "Environmental Action Network",
        "sector": "Environmental Sustainability",
        "domain": "https://environmentalaction.org",
    },
    {
        "id": "org004",
        "name": "Tech Innovation Fund",
        "sector": "Technology & Innovation",
        "domain": "https://techinnovationfund.org",
    },
]

def generate_grant(grant_id):
    org = random.choice(funding_orgs)

    return {
        "id": grant_id,
        "agency": org["name"],
        "applicationDueDate": fake.date_between(start_date="+30d", end_date="+90d").isoformat(),
        "categories": [org["sector"]],
        "contactInformation": {
            "description": None,
            "emailDescription": "Grants Office",
            "email": fake.email(),
            "name": None,
            "phoneNumber": None,
        },
        "description": fake.paragraph(nb_sentences=5),
        "eligibility": {
            "activities": ["Research and Development"],
            "applicants": ["Unrestricted"],
        },
        "estimatedAwardDate": fake.date_between(start_date="+120d", end_date="+180d").isoformat(),
        "fundingAmount": str(fake.random_int(min=50000, max=500000)),
        "fundingTypes": [random.choice(["Grant", "Cooperative Agreement", "Contract"])],
        "howToApply": "Submit via the online form.",
        "website": f"{form_base_url}?grantId={grant_id}&orgId={org['id']}",
        "locations": [random.choice(["Federal", "International", "California", "New York"])],
        "matchRequired": random.choice([True, False]),
        "openDate": fake.date_between(start_date="-30d", end_date="today").isoformat(),
        "otherCategory": org["sector"],
        "status": random.choice(["Posted", "Forecasted", "Rolling", "Closed"]),
        "title": fake.catch_phrase(),
        "totalProgramFunding": str(fake.random_int(min=100000, max=2000000)),
    }

def generate_multiple_grants(n):
    grants = [generate_grant(i) for i in range(1, n + 1)]
    return grants

if __name__ == "__main__":
    grants = generate_multiple_grants(100)
    with open("grants.json", "w") as f:
        json.dump(grants, f, indent=2)
    print("Generated 100 grants and saved to grants.json")