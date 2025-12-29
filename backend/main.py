from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import (
    AnalyzeRequest, AnalyzeResponse,
    GenerateResponseRequest, GenerateResponseResponse,
    DetectSensitiveRequest, DetectSensitiveResponse
)
from services.ai_service import AIService

app = FastAPI(
    title="MedReputation API",
    description="API pour l'analyse de réputation médicale avec Llama 3.2",
    version="1.0.0"
)

# Configuration CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service IA
ai_service = AIService()

@app.get("/")
def read_root():
    return {
        "message": "MedReputation API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/api/analyze",
            "/api/generate-response",
            "/api/detect-sensitive"
        ]
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_reviews(request: AnalyzeRequest):
    """
    Analyse des avis médicaux avec Llama 3.2
    
    - **reviews_text**: Texte des avis à analyser
    - **practice_name**: Nom du cabinet/clinique
    """
    try:
        result = ai_service.analyze_reviews(
            reviews_text=request.reviews_text,
            practice_name=request.practice_name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-response", response_model=GenerateResponseResponse)
async def generate_response(request: GenerateResponseRequest):
    """
    Génère une réponse conforme à la déontologie médicale
    
    - **review_text**: Texte de l'avis
    - **review_rating**: Note de l'avis (1-5)
    - **practice_name**: Nom du cabinet
    - **practice_phone**: Téléphone du cabinet
    """
    try:
        result = ai_service.generate_response(
            review_text=request.review_text,
            review_rating=request.review_rating,
            practice_name=request.practice_name,
            practice_phone=request.practice_phone
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/detect-sensitive", response_model=DetectSensitiveResponse)
async def detect_sensitive(request: DetectSensitiveRequest):
    """
    Détecte les contenus sensibles violant le secret médical
    
    - **review_text**: Texte de l'avis à analyser
    """
    try:
        result = ai_service.detect_sensitive_content(
            review_text=request.review_text
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
