from pydantic import BaseModel
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    reviews_text: str
    practice_name: str

class AnalyzeResponse(BaseModel):
    analysis: str
    metrics: dict

class GenerateResponseRequest(BaseModel):
    review_text: str
    review_rating: int
    practice_name: str
    practice_phone: str

class GenerateResponseResponse(BaseModel):
    response: str
    response_type: str
    compliance_notes: List[str]

class DetectSensitiveRequest(BaseModel):
    review_text: str

class DetectSensitiveResponse(BaseModel):
    has_sensitive_content: bool
    detected_items: List[str]
    risk_score: int
    risk_level: str
    risk_color: str
