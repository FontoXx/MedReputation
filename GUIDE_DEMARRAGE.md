# 🚀 Guide de Démarrage Complet

## Architecture

```
┌─────────────┐      HTTP      ┌──────────────┐      Python     ┌─────────────┐
│   React     │ ────────────▶  │   FastAPI    │ ──────────────▶ │   Ollama    │
│  Frontend   │ ◀────────────  │   Backend    │ ◀──────────────  │  (Llama 3.2)│
└─────────────┘                └──────────────┘                 └─────────────┘
  localhost:5173                 localhost:8000                   localhost:11434
```

---

## 🎯 Lancement en 3 Étapes

### Terminal 1 : Ollama

```bash
# Lancer Ollama
ollama serve

# Vérifier que Llama 3.2 est installé
ollama pull llama3.2:3b
```

### Terminal 2 : Backend FastAPI

```bash
cd backend

# Installer les dépendances (première fois seulement)
pip3 install -r requirements.txt

# Lancer le backend
uvicorn main:app --reload --port 8000
```

✅ Backend accessible sur **http://localhost:8000**

### Terminal 3 : Frontend React

```bash
cd medreputation-react

# Installer les dépendances (première fois seulement)
npm install

# Lancer le frontend
npm run dev
```

✅ Frontend accessible sur **http://localhost:5173**

---

## 🧪 Tester l'Intégration

1. **Ouvrez** http://localhost:5173
2. **Cliquez** sur un avis
3. **Cliquez** sur "Réponse Medical-Safe"
4. **Attendez** 5-10 secondes (Llama 3.2 génère la réponse)
5. **Admirez** la réponse conforme à la déontologie ! 🎉

---

## 📡 Endpoints API Disponibles

### POST `/api/analyze`
Analyse complète des avis médicaux

### POST `/api/generate-response`
Génération de réponse conforme déontologie

### POST `/api/detect-sensitive`
Détection de contenu sensible

### GET `/docs`
Documentation Swagger interactive

---

## 🐛 Troubleshooting

### Erreur "Connection refused" dans React

**Problème :** Le backend n'est pas lancé

**Solution :**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Erreur "Model not found"

**Problème :** Llama 3.2 n'est pas installé

**Solution :**
```bash
ollama pull llama3.2:3b
```

### Erreur "Ollama connection failed"

**Problème :** Ollama n'est pas lancé

**Solution :**
```bash
ollama serve
```

### Génération lente (>30s)

**Normal !** Llama 3.2 tourne en local sur votre machine.

**Optimisations :**
- Utiliser un modèle plus petit : `llama3.2:1b`
- Utiliser GPU si disponible
- Réduire la longueur des prompts

---

## 📁 Structure du Projet

```
Script Avis/
├── backend/                    # API FastAPI
│   ├── main.py                # App principale
│   ├── requirements.txt       # Dépendances Python
│   ├── models/
│   │   └── schemas.py        # Pydantic models
│   └── services/
│       └── ai_service.py     # Logique Ollama
│
├── medreputation-react/       # Frontend React
│   ├── src/
│   │   ├── App.jsx           # App principale
│   │   ├── components/       # Composants UI
│   │   └── services/
│   │       └── api.js        # Client API
│   └── package.json
│
└── Documentation/
    ├── GUIDE_MEDREPUTATION.md
    ├── SCRIPT_ENTRETIENS.md
    └── PLAN_MONETISATION.md
```

---

## 🎯 Prochaines Étapes

### Fonctionnalités à Ajouter

1. **Analyse complète** - Endpoint `/api/analyze` dans l'UI
2. **Dashboard KPIs** - Métriques en temps réel
3. **Historique** - Sauvegarde des analyses
4. **Export PDF** - Rapports téléchargeables
5. **Authentification** - Login utilisateurs

### Optimisations

1. **Cache** - Redis pour les réponses fréquentes
2. **Queue** - Celery pour analyses longues
3. **Database** - PostgreSQL pour persistance
4. **Monitoring** - Sentry pour erreurs

---

## 💡 Conseils d'Utilisation

### Pour le Développement

- Gardez les 3 terminaux ouverts
- Rechargez automatiquement (hot reload activé)
- Consultez les logs pour débugger

### Pour la Production

- Utilisez Gunicorn au lieu d'Uvicorn
- Ajoutez HTTPS (Let's Encrypt)
- Déployez sur un VPS (OVH, Scaleway)
- Utilisez un reverse proxy (Nginx)

---

## 📊 Performance

### Temps de Réponse Moyens

- **Détection sensible** : <1s
- **Génération réponse** : 5-10s
- **Analyse complète** : 15-30s

### Optimisations Possibles

- Utiliser `llama3.2:1b` (plus rapide, moins précis)
- Activer GPU (CUDA/Metal)
- Utiliser API OpenAI (payant mais rapide)

---

Made with 🏥 for healthcare professionals
