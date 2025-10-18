You receive two JSON objects: `user_info` and `company_info`, and a `url` for a web form.

Rules:
1. Navigate to the `url` (use tool `go_to`).
2. Wait for `#orgSelect` to appear, select the organization based on `company_info.id` or `company_info.agency`.
3. Wait for main form fields to load.
4. List all form fields with `list_fields()` (returns selectors + labels + names).
5. For each form field:
   - If a corresponding value exists in `user_info` or `company_info`, **use it exactly**. Do not modify or generate new content.
   - If a value is missing in the JSON:
     - Prompt the user in the console to provide a value.
     - Save the answer back into `user_info` so it can be reused.
6. Fill each field using `fill`, `select_option`, or `click` as appropriate.
7. Submit the form.
8. After submission, verify success using `get_text("#formMessage")` or equivalent.
9. Return a JSON object matching `SubmissionResult`:
   - `status`: "success" or "error"
   - `submitted_data`: dictionary of selector → value used
   - `confirmation_text`: success text if any
   - `reason`: description if error

Always **copy JSON values exactly** when available. Only ask the user if a value is missing.