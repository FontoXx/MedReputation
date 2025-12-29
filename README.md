# 🏥 MedReputation

**Plateforme de gestion des avis médicaux avec réponses IA conformes à la déontologie**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🎯 Vue d'Ensemble

**MedReputation** est une solution complète pour les professionnels de santé permettant de :

- 📊 **Centraliser** tous les avis patients (Google, Doctolib, etc.)
- 🤖 **Générer** des réponses conformes à la déontologie médicale via IA
- 📈 **Analyser** les tendances et KPIs de réputation
- ⚡ **Détecter** automatiquement les contenus sensibles
- 📝 **Créer** des templates de réponses personnalisés

---

## 🚀 Démo en Ligne

🌐 **[medreputation.vercel.app](https://medreputation.vercel.app)** *(Coming Soon)*

---

## ✨ Fonctionnalités Principales

### 🎯 Dashboard Intelligent
- Vue d'ensemble des métriques clés (taux de réponse, note moyenne, etc.)
- Graphiques de tendances temporelles
- Alertes en temps réel pour avis négatifs

### 🤖 IA Déontologique
- Génération de réponses **conformes au code de déontologie**
- Détection automatique de contenu sensible
- Adaptation du ton selon le contexte (positif/négatif)

### 📝 Gestion des Avis
- Import automatique depuis multiples plateformes
- Classification par sentiment (positif/neutre/négatif)
- Historique complet des interactions

### 🎨 Templates Personnalisables
- Bibliothèque de réponses pré-écrites
- Variables dynamiques (nom patient, spécialité, etc.)
- Catégorisation par type d'avis

---

## 🛠️ Stack Technique

### Frontend
- **React 19.2** - UI Framework
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling moderne
- **Framer Motion** - Animations fluides
- **React Router** - Navigation SPA
- **Lucide React** - Icônes

### Backend
- **FastAPI** - API Python haute performance
- **Ollama** - IA locale (Llama 3.2)
- **Pydantic** - Validation de données

### Database & Auth
- **Supabase** - PostgreSQL + Auth
- **Row Level Security** - Sécurité des données

### Deployment
- **Vercel** - Frontend (gratuit)
- **GitHub Actions** - CI/CD

---

## 📦 Installation Locale

### Pré-requis

- Node.js 18+ et npm
- Python 3.9+
- Ollama (pour l'IA locale)
- Compte Supabase (gratuit)

### 1️⃣ Cloner le Projet

```bash
git clone https://github.com/FontoXx/MedReputation.git
cd MedReputation
```

### 2️⃣ Installer Ollama & Modèle IA

```bash
# Installer Ollama (Mac)
brew install ollama

# Lancer Ollama
ollama serve

# Télécharger le modèle Llama 3.2
ollama pull llama3.2:3b
```

### 3️⃣ Configuration Backend

```bash
cd backend

# Installer les dépendances Python
pip3 install -r requirements.txt

# Lancer le backend
uvicorn main:app --reload --port 8000
```

✅ Backend disponible sur **http://localhost:8000**

### 4️⃣ Configuration Frontend

```bash
cd medreputation-react

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos credentials Supabase
# Voir DEPLOIEMENT_VERCEL.md pour récupérer vos clés
```

**Contenu du `.env` :**
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

```bash
# Lancer le frontend
npm run dev
```

✅ Frontend disponible sur **http://localhost:5173**

---

## 📖 Documentation

- 📘 [**Guide de Démarrage Complet**](GUIDE_DEMARRAGE.md)
- 🚀 [**Guide de Déploiement Vercel**](DEPLOIEMENT_VERCEL.md)
- 🗄️ [**Activation Supabase**](ACTIVATION_SUPABASE.md)
- 📊 [**Plan de Monétisation**](PLAN_MONETISATION.md)
- 🎯 [**Guide MedReputation**](GUIDE_MEDREPUTATION.md)

---

## 🏗️ Architecture

```
┌─────────────────┐      HTTPS      ┌──────────────────┐
│   React SPA     │ ◄────────────► │   Supabase       │
│  (Vercel)       │                 │  (PostgreSQL)    │
└─────────────────┘                 └──────────────────┘
        │
        │ HTTP
        ▼
┌─────────────────┐      Python     ┌──────────────────┐
│   FastAPI       │ ◄────────────► │   Ollama         │
│   Backend       │                 │  (Llama 3.2)     │
└─────────────────┘                 └──────────────────┘
```

---

## 🧪 Tests Rapides

1. **Ouvrir** http://localhost:5173
2. **Se connecter** avec un compte Supabase
3. **Cliquer** sur un avis
4. **Générer** une réponse IA
5. **Observer** la conformité déontologique ! 🎉

---

## 📊 Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/analyze` | POST | Analyse complète d'un avis |
| `/api/generate-response` | POST | Génération de réponse IA |
| `/api/detect-sensitive` | POST | Détection de contenu sensible |
| `/docs` | GET | Documentation Swagger interactive |

---

## 🔐 Sécurité

- ✅ **Row Level Security (RLS)** activé sur toutes les tables
- ✅ **Authentification JWT** via Supabase
- ✅ **Variables d'environnement** pour credentials
- ✅ **HTTPS** obligatoire en production
- ✅ **Sanitization** des inputs utilisateur

---

## 🚀 Déploiement Production

### Frontend (Vercel)

```bash
# Déjà configuré avec vercel.json
# Suivre le guide : DEPLOIEMENT_VERCEL.md

# Déploiement automatique à chaque push sur main
```

### Backend (Optionnel)

Le backend peut être déployé sur :
- **Render.com** (gratuit avec limitations)
- **Railway.app** (500h/mois gratuit)
- **Fly.io** (gratuit avec limitations)

Voir [DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md) pour plus de détails.

---

## 📈 Roadmap

### Version 1.0 (Actuelle)
- ✅ Dashboard de base
- ✅ Génération de réponses IA
- ✅ Authentification Supabase
- ✅ Templates de réponses

### Version 1.1 (À venir)
- [ ] Import automatique Google/Doctolib
- [ ] Export PDF des rapports
- [ ] Notifications push
- [ ] Mode multi-praticien

### Version 2.0 (Futur)
- [ ] App mobile (React Native)
- [ ] Intégration calendrier
- [ ] Analytics avancés
- [ ] API publique

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 License

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍⚕️ Auteur

**FontoXx**
- GitHub: [@FontoXx](https://github.com/FontoXx)

---

## 🙏 Remerciements

- [Supabase](https://supabase.com) - Backend as a Service
- [Ollama](https://ollama.ai) - IA locale
- [Vercel](https://vercel.com) - Hébergement
- [FastAPI](https://fastapi.tiangolo.com) - Framework Python
- [React](https://reactjs.org) - UI Library

---

## 📞 Support

Pour toute question ou problème :
- 📧 Ouvrir une [Issue GitHub](https://github.com/FontoXx/MedReputation/issues)
- 📖 Consulter la [Documentation](GUIDE_DEMARRAGE.md)

---

<div align="center">

**Made with 🏥 for healthcare professionals**

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une star !

</div>
