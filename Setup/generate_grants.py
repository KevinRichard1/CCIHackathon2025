import random
import json
from faker import Faker
import os

fake = Faker()

form_base_url = "https://kevinrichard1.github.io/CCIHackathon2025/index.html"

funding_orgs = [
    {
        "id": "org001",
        "name": "Health & Research Foundation",
        "sector": "Health & Human Services",
        "domain": "https://healthresearch.org",
        "logo": "",
    },
    {
        "id": "org002",
        "name": "Arts & Culture Trust",
        "sector": "Arts & Culture",
        "domain": "https://artsandculturetrust.org",
        "logo": "https://example.com/logos/arts.png",
    },
    {
        "id": "org003",
        "name": "Environmental Action Network",
        "sector": "Environmental Sustainability",
        "domain": "https://environmentalaction.org",
        "logo": "https://example.com/logos/environment.png",
    },
    {
        "id": "org004",
        "name": "Tech Innovation Fund",
        "sector": "Technology & Innovation",
        "domain": "https://techinnovationfund.org",
        "logo": "https://example.com/logos/tech.png",
    },
]

sector_logo_prefixes = {
    "Arts & Culture": "arts_logo",
    "Environmental Sustainability": "env_logo",
    "Health & Human Services": "health_logo",
    "Technology & Innovation": "tech_logo",
}

sector_descriptions = {
    "Health & Human Services": {
        "short": [
            "Improving access to quality healthcare and promoting public health.",
            "Support for community wellness and health equity initiatives.",
            "Funding programs that address mental health, substance abuse, and chronic disease prevention.",
            "Empowering communities to lead healthier, more resilient lives."
        ],
        "long": [
            "This grant aims to support initiatives that improve healthcare delivery, enhance access to essential services, and address systemic health disparities. Applicants may focus on underserved populations, rural health systems, or preventative care models. Programs that integrate mental health services, chronic disease management, or community-based health education are highly encouraged. Collaborative proposals involving partnerships between public health agencies, nonprofits, and community organizations will be prioritized. Projects should demonstrate measurable outcomes and scalability beyond the grant period. Innovative approaches to health equity and culturally responsive care are strongly welcomed. Funding may be used for service delivery, capacity building, and data-driven evaluation models.",
            
            "This funding opportunity is designed to strengthen community health by supporting programs that expand access to primary care, behavioral health, and social services. Organizations working in marginalized or high-risk communities are encouraged to apply. Special consideration will be given to initiatives that address the social determinants of health and promote long-term health equity. Programs may include mobile clinics, telehealth solutions, or education campaigns aimed at prevention. Cross-sector collaborations and local stakeholder involvement will enhance competitiveness. Applicants must show a clear plan for implementation, sustainability, and outcome measurement. Budget allocations should align with project goals and community needs."
        ]
    },

    "Arts & Culture": {
        "short": [
            "Fostering creativity and preserving cultural heritage.",
            "Support for community-based arts and cultural initiatives.",
            "Funding for artists, storytellers, and cultural institutions.",
            "Celebrating diversity through the arts."
        ],
        "long": [
            "This grant supports artistic and cultural projects that inspire, engage, and reflect the diversity of their communities. Eligible programs may include exhibitions, performances, public art, arts education, or cultural preservation initiatives. Emphasis is placed on projects that amplify underrepresented voices and traditions. Applicants may be individual artists, collectives, or nonprofit organizations working in the arts sector. Partnerships with schools, libraries, or local governments are encouraged. Funding may be used for materials, staffing, outreach, and production costs. A strong community engagement component and impact evaluation plan will strengthen proposals.",
            
            "Designed to nurture the creative sector, this grant enables artists and organizations to develop, present, and expand their work within the public sphere. Projects that encourage intergenerational, cross-cultural, or interdisciplinary collaboration are welcomed. Proposals should articulate a compelling artistic vision and outline how the work will engage and benefit the community. Opportunities for public participation or educational programming are considered valuable assets. Applicants should include a realistic timeline, budget justification, and an explanation of the project's long-term value. Both emerging and established practitioners are encouraged to apply. Matching funds or in-kind support are beneficial but not required."
        ]
    },

    "Environmental Sustainability": {
        "short": [
            "Funding for climate action, conservation, and green innovation.",
            "Promoting environmental stewardship and community resilience.",
            "Support for clean energy, sustainability, and ecosystem protection.",
            "Backing bold solutions to today’s environmental challenges."
        ],
        "long": [
            "This grant supports environmental initiatives that aim to protect natural ecosystems, reduce carbon emissions, and foster climate resilience. Priority will be given to projects that demonstrate clear environmental outcomes and active community involvement. Eligible activities include renewable energy implementation, habitat restoration, sustainable agriculture, and environmental education. Applicants may include nonprofits, research institutions, or coalitions working at local, regional, or global scales. Proposals should highlight innovation, scalability, and long-term environmental impact. Inclusion of underserved or disproportionately affected populations is strongly encouraged. Funds may cover planning, infrastructure, outreach, and evaluation efforts.",
            
            "Designed to address the urgent challenges of climate change and ecological degradation, this funding opportunity seeks projects that deliver measurable and lasting environmental benefits. Emphasis is placed on community-driven solutions and cross-sector partnerships. Applications should describe how the proposed activities contribute to conservation, climate adaptation, or sustainability goals. Strong proposals will include a logic model or theory of change, along with baseline data and evaluation metrics. Grant funding can support pilot programs, public campaigns, research, or policy advocacy. Projects that integrate indigenous knowledge, youth engagement, or environmental justice frameworks are especially encouraged. Applicants must outline a plan for implementation, community engagement, and reporting outcomes."
        ]
    },

    "Technology & Innovation": {
        "short": [
            "Driving innovation to solve social and technological challenges.",
            "Support for impactful tech solutions and digital transformation.",
            "Funding for R&D, emerging technologies, and digital equity.",
            "Backing bold ideas at the intersection of tech and humanity."
        ],
        "long": [
            "This grant supports the development and deployment of technology-driven solutions that address complex social, economic, or environmental challenges. Ideal applicants include nonprofits, startups, research labs, or academic institutions working on innovative tools, platforms, or systems. Projects may involve data science, AI, civic tech, mobile solutions, or hardware prototyping. Emphasis is placed on usability, scalability, and equity—especially for marginalized populations. Proposals must outline a problem statement, technical approach, and expected outcomes, including how success will be measured. Open-source initiatives and those promoting digital inclusion are particularly welcomed. Funding may cover development, testing, staff, infrastructure, and community engagement costs.",
            
            "This opportunity is aimed at innovators leveraging technology to create measurable public benefit across domains like health, education, environment, or governance. Applicants should clearly define the challenge they are addressing and provide a compelling solution supported by user research or pilot data. Cross-functional teams, especially those with lived experience of the issue, are encouraged to apply. Proposals should include a roadmap for development and deployment, along with data privacy and ethical considerations. Projects that ensure equitable access and minimize algorithmic bias will be prioritized. Grant funds can support MVP development, user testing, stakeholder outreach, and impact analysis. Sustainability beyond the grant period is a key review criterion."
        ]
    }
}

def load_logos_by_sector(folder_path):
    files = os.listdir(folder_path)
    logos_by_sector = {}

    for sector, prefix in sector_logo_prefixes.items():
        logos = [f for f in files if f.startswith(prefix)]
        logos_by_sector[sector] = logos

    return logos_by_sector

def get_random_logo_for_sector(sector, logos_by_sector, base_url):
    logos = logos_by_sector.get(sector, [])
    if not logos:
        return None
    return f"{base_url}/{random.choice(logos)}"

logo_folder = "../docs/logos"
logo_base_url = "https://kevinrichard1.github.io/CCIHackathon2025/logos"
logos_by_sector = load_logos_by_sector(logo_folder)

def generate_grant(grant_id):
    org = random.choice(funding_orgs)
    sector = org["sector"] 

    short_desc = random.choice(sector_descriptions.get(sector, {}).get("short", ["Innovative community-focused funding opportunity."]))
    long_desc = random.choice(sector_descriptions.get(sector, {}).get("long", ["This funding opportunity supports impactful, mission-aligned initiatives that address pressing social needs."]))

    return {
        "id": grant_id,
        "agency": org["name"],
        "logo": get_random_logo_for_sector(sector, logos_by_sector, logo_base_url),
        "applicationDueDate": fake.date_between(start_date="+30d", end_date="+90d").isoformat(),
        "shortDescription": short_desc,
        "description": long_desc,
        "categories": [org["sector"]],
        "contactInformation": {
            "description": None,
            "emailDescription": "Grants Office",
            "email": fake.email(),
            "name": None,
            "phoneNumber": None,
        },
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