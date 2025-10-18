import os
import pytest
import asyncio
from agents import Agent, Runner
from tools.browser_tool import BrowserTool
from schemas.input_schemas import UserInfo, CompanyInfo, SubmissionInput
from agent.agent_config import run_agent
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)

user_info_obj = UserInfo(
    first_name="Alice",
    last_name="Smith",
    email="alice@example.com"
)

company_info_obj = CompanyInfo(
    id="123",
    agency="Test Agency",
    logo="https://example.com/logo.png",
    applicationDueDate="2025-12-31",
    shortDescription="Test short description",
    description="Test long description",
    categories=["Tech", "Education"],
    contactInformation="contact@example.com",
    eligibility="Anyone",
    estimatedAwardDate="2026-01-31",
    fundingAmount=100000,
    fundingTypes=["Grant"],
    howToApply="Online",
    website="https://example.com/form",  # must be http/https
    locations=["Remote"],
    matchRequired=False,
    openDate="2025-01-01",
    otherCategory="Misc",
    status="Open",
    title="Test Program",
    totalProgramFunding=1000000
)

submission_input = SubmissionInput(
    user_info=user_info_obj,
    company_info=company_info_obj,
    url="https://example.com/form"  # must be http/https
)

@pytest.mark.asyncio
async def test_dummy_form_submission(tmp_path):
    # Create a simple HTML form for testing
    test_html = tmp_path / "form.html"
    test_html.write_text("""
    <html><body>
    <form>
      <label>First Name: <input id="fname" name="fname" /></label><br/>
      <label>Last Name: <input id="lname" name="lname" /></label><br/>
      <label>Email: <input id="email" name="email" /></label><br/>
      <button type="submit">Submit</button>
    </form>
    <div class="confirmation">Thank you!</div>
    </body></html>
    """, encoding='utf-8')

    url = f"file://{test_html}"
    user_info = {"first_name": "Alice", "last_name": "Smith", "email": "alice@example.com"}
    company_info = {"website": url}

    # Initialize the browser tool
    browser = BrowserTool(headless=False)

    # Define the agent with instructions
    agent = Agent(
        name="Form Filler Agent",
        instructions="Fill out the provided form with the given user and company information."
    )

    # Run the agent using the Runner
    final_output = await run_agent(agent, input=submission_input)
    assert "Thank you!" in final_output