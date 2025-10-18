from pydantic import BaseModel
from typing import Dict, Any, Optional, Literal

class SubmissionResult(BaseModel):
    status: Literal["success", "error"]
    submitted_data: Dict[str, Any]
    confirmation_text: Optional[str]
    reason: Optional[str]