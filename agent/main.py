import argparse
import json
import os
import asyncio
from dotenv import load_dotenv

from tools.browser_tool import BrowserTool
from agent_config import build_agent, run_agent
from util.logger import setup_logging

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

async def main():
    setup_logging()
    load_dotenv()
    parser = argparse.ArgumentParser(description="Run form-filler agent")
    parser.add_argument("--user_json", required=True, help="Path to user JSON")
    parser.add_argument("--company_json", required=True, help="Path to company JSON")
    args = parser.parse_args()

    user_json_path = args.user_json
    company_json_path = args.company_json

    user_info = load_json(user_json_path)
    company_info = load_json(company_json_path)
    
    # Pull URL directly from company info
    company_info = load_json(args.company_json)[0]
    url = company_info["website"]

    browser = BrowserTool(headless=(os.getenv("BROWSER_HEADLESS", "true").lower() == "true"))
    agent = build_agent(browser)

    try:
        result = await run_agent(agent, browser, user_info, company_info, url)
        print("Result:", json.dumps(result, indent=2))

        # Save updated user_info with any new fields entered by the agent
        save_json(user_json_path, user_info)
        print(f"Updated user JSON saved to {user_json_path}")

    finally:
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())