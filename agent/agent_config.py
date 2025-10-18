import os
import json
from pydantic import BaseModel
from agents import Agent, Runner, function_tool
from schemas.input_schemas import UserInfo, CompanyInfo, SubmissionInput
from schemas.output_schemas import SubmissionResult
from typing import List, Dict, Any
from dotenv import load_dotenv
from openai import OpenAI
import asyncio
from urllib.parse import urlparse, parse_qs

load_dotenv()
client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)

def load_instructions(path: str) -> str:
    base_path = os.path.dirname(__file__)
    path = os.path.join(base_path, path)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_agent(browser_tool):
    instructions = load_instructions("prompts/agent_prompt.md")

    # Wrap browser tool methods as function_tools for the agent
    @function_tool
    def go_to(url: str) -> str:
        return browser_tool.go_to(url)

    @function_tool
    def list_fields() -> list:
        return browser_tool.list_fields()

    @function_tool
    def fill(selector: str, value: str) -> str:
        return browser_tool.fill(selector, value)

    @function_tool
    def select_option(selector: str, value: str) -> str:
        return browser_tool.select(selector, value)

    @function_tool
    def click(selector: str) -> str:
        return browser_tool.click(selector)

    @function_tool
    def get_text(selector: str) -> str:
        return browser_tool.get_text(selector)

    tools = [go_to, list_fields, fill, select_option, click, get_text]

    agent = Agent(
        name="FormFillerAgent",
        instructions=instructions,
        model="gpt-4o-mini",
        tools=tools,
        output_type=SubmissionResult
    )
    return agent

async def find_best_matches(fields, user_info, company_info):
    mapping = {}
    for f in fields:
        sel = f["selector"]
        name = f["name"]
        if name == "title":
            mapping[sel] = company_info["title"]
        elif name == "applicantName":
            mapping[sel] = f"{user_info['first_name']} {user_info['last_name']}"
        elif name == "email":
            mapping[sel] = user_info["email"]
        elif name == "fundingAmount":
            mapping[sel] = str(company_info["fundingAmount"])
        elif name == "projectSummary":
            mapping[sel] = company_info.get("shortDescription") or company_info.get("description")
        elif name == "startDate":
            mapping[sel] = company_info["openDate"]
        elif name == "endDate":
            mapping[sel] = company_info["estimatedAwardDate"]
        elif name == "orgId":
            mapping[sel] = str(company_info["id"])
    return mapping

async def get_value_for_field(field_name, user_info, company_info, user_json_path="./data/user.json"):
    """
    Get a value for a form field. First check user_info, then company_info.
    If missing, generate a placeholder and save it into user.json automatically.
    """
    if not field_name:
        field_name = "unknown_field"

    # Try user_info
    if field_name in user_info and user_info[field_name]:
        return user_info[field_name]

    # Try company_info
    if field_name in company_info and company_info[field_name]:
        return company_info[field_name]

    # Generate a placeholder if missing
    placeholder = f"placeholder_{field_name}"

    # Save into user_info and persist to user.json
    user_info[field_name] = placeholder
    try:
        os.makedirs(os.path.dirname(user_json_path), exist_ok=True)
        with open(user_json_path, "w", encoding="utf-8") as f:
            json.dump(user_info, f, indent=2)
    except Exception as e:
        print(f"Could not save placeholder to {user_json_path}: {e}")

    return placeholder

async def run_agent(agent: Agent, browser_tool, user_info: dict, company_info: dict, url: str):
    # Go to form URL
    await browser_tool.go_to(url)

    # List all fields on the page
    fields = await browser_tool.list_fields()

    # Map base fields to values
    mapping = await find_best_matches(fields, user_info, company_info)
    submitted_data = {}

    # Determine org mapping based on agency
    agency_to_org = {
        "Health & Research Foundation": "org001",
        "Arts & Culture Trust": "org002",
        "Environmental Action Network": "org003",
        "Tech Innovation Fund": "org004"
    }
    org_value = agency_to_org.get(company_info.get("agency"), "org001")

    # Wait for the org selector and select it
    await browser_tool.page.wait_for_selector("#orgSelect", timeout=15000)
    await browser_tool.select("#orgSelect", org_value)

    # Small delay to allow dynamic fields to render
    await asyncio.sleep(0.5)

    # Refresh fields after selecting org
    fields = await browser_tool.list_fields()

    for field in fields:
        sel = field.get("selector")
        name = field.get("name")
        field_type = field.get("type", "input")

        # Determine value
        if sel in mapping and mapping[sel] is not None:
            value = mapping[sel]
        elif name in user_info and user_info[name] is not None:
            value = user_info[name]
        elif name in company_info and company_info[name] is not None:
            value = company_info[name]
        else:
            # Default empty string if no value found
            value = ""

        # Small delay before filling each field
        await asyncio.sleep(0.1)

        # Fill based on type
        if field_type in ("select", "dropdown"):
            await browser_tool.select(sel, str(value))
        elif field_type == "checkbox":
            if value:
                await browser_tool.click(sel)
        elif field_type == "radio":
            # Click the radio button with matching value
            options = await browser_tool.page.query_selector_all(f"{sel} input[type=radio]")
            for opt in options:
                radio_val = await opt.get_attribute("value")
                if str(radio_val) == str(value):
                    await opt.click()
                    break
        else:
            # Only fill if it's an input/textarea
            el_handle = await browser_tool.page.query_selector(sel)
            if el_handle:
                tag = await el_handle.evaluate("(el) => el.tagName.toLowerCase()")
                if tag in ("input", "textarea") or await el_handle.get_attribute("contenteditable") == "true":
                    await browser_tool.fill(sel, str(value))

        submitted_data[sel] = value

    # Submit the form
    await browser_tool.click("button[type=submit]")

    # Capture confirmation text
    try:
        confirmation_text = await browser_tool.get_text("#formMessage .success-message")
    except Exception:
        confirmation_text = ""

    return {
        "status": "success" if confirmation_text else "error",
        "submitted_data": submitted_data,
        "confirmation_text": confirmation_text
    }
