# ✅ Checklist de Déploiement Vercel

## 📋 Avant le Déploiement

### Fichiers de Configuration
- [x] ✅ `vercel.json` créé dans `medreputation-react/`
- [x] ✅ `.gitignore` protège les fichiers sensibles
- [x] ✅ `.env.example` fourni comme template
- [x] ✅ `package.json` avec commande `build` correcte
- [x] ✅ `README.md` avec documentation complète

### Sécurité
- [x] ✅ Fichier `.env` exclu de Git (vérifié)
- [x] ✅ `node_modules/` exclu de Git
- [x] ✅ Credentials Supabase NON commitées

### Code Poussé sur GitHub
- [x] ✅ Repository créé : https://github.com/FontoXx/MedReputation
- [x] ✅ Tous les fichiers poussés (3 commits)
- [x] ✅ Branche `main` prête

---

## 🚀 Étapes de Déploiement

### 1. Création du Projet Vercel

- [ ] Aller sur [vercel.com](https://vercel.com)
- [ ] Se connecter avec GitHub
- [ ] Cliquer "Add New Project"
- [ ] Importer `FontoXx/MedReputation`

### 2. Configuration du Build

**Paramètres à vérifier :**

```
Framework Preset: Vite
Root Directory: medreputation-react  ⚠️ IMPORTANT
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x (ou plus récent)
```

### 3. Variables d'Environnement

**À ajouter dans Vercel Settings → Environment Variables :**

| Variable | Où la trouver | Format |
|----------|---------------|--------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public | `eyJhbGci...` (long token) |

**⚠️ NE PAS utiliser** : `service_role` key (c'est la clé secrète !)

### 4. Configuration Supabase

- [ ] Se connecter à [supabase.com](https://supabase.com)
- [ ] Aller dans **Authentication → URL Configuration**
- [ ] Ajouter l'URL Vercel dans **Site URL** :
  ```
  https://medreputation.vercel.app
  ```
- [ ] Ajouter dans **Redirect URLs** :
  ```
  https://medreputation.vercel.app/**
  https://*.vercel.app/**
  ```

### 5. Activer Row Level Security (RLS)

**Dans Supabase SQL Editor, exécuter :**

```sql
-- Tables principales
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (exemple)
CREATE POLICY "Allow read access" 
ON practices FOR SELECT 
USING (true);

-- Politique d'écriture pour utilisateurs authentifiés
CREATE POLICY "Allow insert for auth users" 
ON practices FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Répéter pour chaque table selon vos besoins
```

### 6. Déploiement

- [ ] Cliquer sur **Deploy** dans Vercel
- [ ] Attendre 2-3 minutes (build + déploiement)
- [ ] Vérifier l'URL de déploiement

---

## 🧪 Tests Post-Déploiement

### Tests Fonctionnels

- [ ] ✅ Page d'accueil charge sans erreur
- [ ] ✅ Login/Signup fonctionne
- [ ] ✅ Connexion à Supabase réussie
- [ ] ✅ Affichage des données en live
- [ ] ✅ Navigation entre pages (pas de 404)
- [ ] ✅ Responsive design (mobile/tablet)

### Tests Console Navigateur

**Ouvrir DevTools (F12) → Console :**

- [ ] ✅ Pas d'erreur CORS
- [ ] ✅ Pas d'erreur Supabase connection
- [ ] ✅ Variables d'environnement chargées

**Vérifier en console :**
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// Doit afficher votre URL Supabase
```

### Tests Performance

- [ ] ✅ Lighthouse Score > 90
- [ ] ✅ First Contentful Paint < 2s
- [ ] ✅ Time to Interactive < 3s

**Tester avec :** [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 🐛 Troubleshooting

### Erreur : "Failed to fetch from Supabase"

**Causes possibles :**
1. ❌ Variables d'environnement mal configurées
2. ❌ URL Supabase incorrecte (vérifier pas de `/` final)
3. ❌ Clé anon incorrecte

**Solution :**
- Vérifier les variables dans Vercel → Settings → Environment Variables
- Redéployer après modification : Deployments → ⋯ → Redeploy

### Erreur : 404 sur les routes (ex: /dashboard)

**Cause :**
- Redirections SPA non configurées

**Solution :**
- Vérifier que `vercel.json` est présent dans `medreputation-react/`
- Vérifier que Root Directory = `medreputation-react`

### Erreur : "Cannot read property of undefined"

**Cause :**
- Variables d'environnement non accessibles

**Solution :**
- Les variables **DOIVENT** commencer par `VITE_`
- Redéployer après ajout de variables

### Build Failed

**Vérifier :**
```bash
# Tester le build localement
cd medreputation-react
npm run build

# Si erreur, voir les logs
npm run build --verbose
```

---

## 🎯 URLs à Retenir

| Ressource | URL |
|-----------|-----|
| **GitHub Repo** | https://github.com/FontoXx/MedReputation |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Supabase Dashboard** | https://supabase.com/dashboard |
| **Votre App (après déploiement)** | https://medreputation.vercel.app |

---

## 📊 Métriques de Succès

### Plan Gratuit Vercel

- ✅ **Builds** : 100h/mois (largement suffisant)
- ✅ **Bande passante** : 100 GB/mois
- ✅ **Déploiements** : Illimités
- ✅ **SSL/HTTPS** : Inclus
- ✅ **CDN** : Global

### Supabase Free Tier

- ✅ **Base de données** : 500 MB
- ✅ **Bande passante** : 5 GB/mois
- ✅ **API Requests** : Illimitées
- ✅ **Authentification** : 50,000 utilisateurs actifs

---

## 🎉 Une Fois Déployé

### Fonctionnalités Automatiques Vercel

- ✅ **Déploiement auto** : Chaque push sur `main` = nouveau déploiement
- ✅ **Preview Deployments** : Chaque Pull Request = preview URL
- ✅ **Rollback** : Retour version précédente en 1 clic
- ✅ **Analytics** : Statistiques de visite
- ✅ **Logs** : Debugging en temps réel

### Optimisations Futures

- [ ] Ajouter un domaine personnalisé (gratuit)
- [ ] Configurer les Analytics Vercel
- [ ] Activer Web Vitals monitoring
- [ ] Mettre en place des alertes d'erreur

---

## 📝 Notes Importantes

### ⚠️ Backend Non Déployé

Le backend FastAPI (avec Ollama/IA) n'est **PAS** déployé sur Vercel.

**Pour déployer le backend aussi :**
- Utiliser [Render.com](https://render.com) (gratuit)
- Utiliser [Railway.app](https://railway.app) (500h/mois)
- Utiliser [Fly.io](https://fly.io) (gratuit avec limites)

**Alternative :** Désactiver les features IA en production et garder uniquement Supabase.

### 🔄 Cycle de Déploiement

```
1. Code en local
   ↓
2. git push origin main
   ↓
3. Vercel détecte le push
   ↓
4. Build automatique
   ↓
5. Déploiement en production
   ↓
6. URL mise à jour (< 2 min)
```

---

## ✅ Checklist Finale

Avant de cliquer sur Deploy :

- [ ] ✅ Root Directory = `medreputation-react`
- [ ] ✅ Variables d'environnement configurées (VITE_SUPABASE_*)
- [ ] ✅ Supabase URLs autorisées
- [ ] ✅ RLS activé sur les tables
- [ ] ✅ Build local réussi (`npm run build`)
- [ ] ✅ Derniers changements poussés sur GitHub

---

## 🎊 Félicitations !

Une fois tout vérifié, vous êtes prêt à déployer ! 🚀

**Temps estimé : 10 minutes**

---

*Dernière mise à jour : 2025-12-29*
