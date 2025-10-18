from playwright.async_api import async_playwright
import asyncio

class BrowserTool:
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.playwright = None
        self.browser = None
        self.page = None

    async def _ensure_started(self):
        if not self.playwright:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=self.headless)
            self.page = await self.browser.new_page()

    async def go_to(self, url: str) -> str:
        await self._ensure_started()
        await self.page.goto(url)
        return f"Navigated to {url}"

    async def list_fields(self) -> list:
        await self._ensure_started()
        elems = await self.page.query_selector_all("input, select, textarea")
        result = []
        for el in elems:
            id_attr = await el.get_attribute("id")
            name_attr = await el.get_attribute("name")
            if id_attr:
                selector = f"#{id_attr}"
            elif name_attr:
                selector = f'[name="{name_attr}"]'
            else:
                continue

            label = await el.evaluate("(el) => { const l = el.closest('label'); return l ? l.innerText : null; }")
            result.append({"selector": selector, "label": label, "name": name_attr})
        return result

    async def fill(self, selector: str, value: str) -> str:
        await self._ensure_started()
        el = await self.page.wait_for_selector(selector, state="visible", timeout=15000)
        await el.fill(str(value))
        return f"Filled {selector} with {value}"

    async def select(self, selector: str, value) -> str:
        await self._ensure_started()
        # Convert to string to avoid TypeError with integers
        value_str = str(value)
        await self.page.select_option(selector, value_str)
        return f"Selected {value_str} in {selector}"

    async def click(self, selector: str) -> str:
        await self._ensure_started()
        el = await self.page.wait_for_selector(selector, state="visible", timeout=15000)
        await el.click()
        return f"Clicked {selector}"

    async def get_text(self, selector: str) -> str:
        await self._ensure_started()
        text = await self.page.inner_text(selector)
        return text

    async def close(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def wait_for_selector(self, selector: str, timeout_ms: int = 5000) -> str:
        await self._ensure_started()
        await self.page.wait_for_selector(selector, timeout=timeout_ms)
        return f"Selector {selector} is now visible (timeout={timeout_ms}ms)"
