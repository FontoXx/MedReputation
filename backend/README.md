# 🏥 MedReputation Backend API

API FastAPI pour l'analyse de réputation médicale avec Llama 3.2 (Ollama).

## 🚀 Démarrage Rapide

### 1. Installer les dépendances

```bash
cd backend
pip3 install -r requirements.txt
```

### 2. Vérifier qu'Ollama est lancé

```bash
# Terminal 1
ollama serve

# Vérifier que Llama 3.2 est installé
ollama pull llama3.2:3b
```

### 3. Lancer le backend

```bash
# Terminal 2
cd backend
uvicorn main:app --reload --port 8000
```

L'API sera accessible sur **http://localhost:8000**

## 📡 Endpoints

### GET `/`
Informations sur l'API

### GET `/health`
Health check

### POST `/api/analyze`
Analyse des avis médicaux

**Request:**
```json
{
  "reviews_text": "Excellent cabinet, très professionnel...",
  "practice_name": "Cabinet Dr. Dupont"
}
```

**Response:**
```json
{
  "analysis": "Rapport complet...",
  "metrics": {
    "satisfaction_score": 8.5,
    "positive_ratio": 75
  }
}
```

### POST `/api/generate-response`
Génération de réponse conforme

**Request:**
```json
{
  "review_text": "Temps d'attente trop long...",
  "review_rating": 2,
  "practice_name": "Cabinet Dr. Dupont",
  "practice_phone": "01 23 45 67 89"
}
```

**Response:**
```json
{
  "response": "Bonjour,\n\nNous prenons...",
  "response_type": "Négatif - Confidentialité requise",
  "compliance_notes": ["✅ Respect du secret médical"]
}
```

### POST `/api/detect-sensitive`
Détection de contenu sensible

**Request:**
```json
{
  "review_text": "Le Dr. Martin m'a diagnostiqué un diabète..."
}
```

**Response:**
```json
{
  "has_sensitive_content": true,
  "detected_items": ["Nom: Dr. Martin", "Diagnostic: diabète"],
  "risk_score": 5,
  "risk_level": "MOYEN"
}
```

## 🧪 Tester l'API

### Avec curl

```bash
# Health check
curl http://localhost:8000/health

# Générer une réponse
curl -X POST http://localhost:8000/api/generate-response \
  -H "Content-Type: application/json" \
  -d '{
    "review_text": "Excellent médecin",
    "review_rating": 5,
    "practice_name": "Cabinet Dr. Dupont",
    "practice_phone": "01 23 45 67 89"
  }'
```

### Documentation interactive

Ouvrez http://localhost:8000/docs pour Swagger UI

## 📁 Structure

```
backend/
├── main.py                 # FastAPI app
├── requirements.txt        # Dépendances
├── models/
│   ├── __init__.py
│   └── schemas.py         # Pydantic models
└── services/
    ├── __init__.py
    └── ai_service.py      # Logique Ollama
```

## 🔧 Technologies

- **FastAPI** 0.115.0
- **Uvicorn** 0.32.0
- **Ollama** 0.4.4 (Python SDK)
- **Pydantic** 2.10.3

## 🐛 Troubleshooting

### Erreur "Connection refused"
→ Vérifiez qu'Ollama est lancé: `ollama serve`

### Erreur "Model not found"
→ Téléchargez le modèle: `ollama pull llama3.2:3b`

### CORS Error
→ Le backend autorise uniquement `http://localhost:5173` (React)

---

Made with 🏥 for healthcare professionals
