# 🚀 Guide de Déploiement sur Vercel

## ✅ Pré-requis de Déploiement

Votre projet **MedReputation** est maintenant prêt pour Vercel ! Voici ce qui a été vérifié :

### 1. ✅ Configuration Build (package.json)
- ✅ `"build": "vite build"` - Commande de build configurée
- ✅ `"preview": "vite preview"` - Test en local possible
- ✅ Framework : Vite + React
- ✅ Toutes les dépendances listées correctement

### 2. ✅ Configuration Vercel (vercel.json)
- ✅ Redirections SPA configurées (toutes les routes → index.html)
- ✅ Output directory : `dist` (dossier de build Vite)
- ✅ Variables d'environnement configurées pour Supabase
- ✅ Framework détecté automatiquement : Vite

### 3. ✅ Fichiers Sensibles Protégés (.gitignore)
- ✅ `.env` et `.env.local` exclus de Git
- ✅ `node_modules/` exclu
- ✅ `dist/` exclu (sera construit par Vercel)
- ✅ Fichiers IDE et logs exclus

---

## 🌐 Étapes de Déploiement

### Étape 1️⃣ : Préparer Votre Compte Vercel

1. **Créer un compte Vercel (gratuit)**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Sign Up"
   - Connectez-vous avec votre compte GitHub (recommandé)

2. **Lier votre dépôt GitHub**
   - Une fois connecté, cliquez sur "Add New Project"
   - Sélectionnez "Import Git Repository"
   - Choisissez votre repo : `FontoXx/MedReputation`

### Étape 2️⃣ : Configurer le Projet sur Vercel

#### Configuration de Build

Vercel détectera automatiquement Vite, mais vérifiez :

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: medreputation-react
```

⚠️ **IMPORTANT** : Spécifiez `medreputation-react` comme **Root Directory** car votre frontend est dans ce sous-dossier !

### Étape 3️⃣ : Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez ces variables :

| Nom de la Variable | Valeur | Description |
|-------------------|--------|-------------|
| `VITE_SUPABASE_URL` | `https://[votre-projet].supabase.co` | URL de votre projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Clé publique Supabase (anon/public) |

**Comment trouver ces valeurs ?**

#### Récupérer vos Credentials Supabase :

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Ouvrez votre projet MedReputation
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

⚠️ **NE PAS utiliser le `service_role` key** - c'est votre clé secrète !

### Étape 4️⃣ : Déployer

1. Cliquez sur **Deploy**
2. Vercel va :
   - ✅ Installer les dépendances (`npm install`)
   - ✅ Construire votre app (`npm run build`)
   - ✅ Déployer sur un domaine `.vercel.app`

3. Après 2-3 minutes, vous aurez un lien du type :
   ```
   https://medreputation.vercel.app
   ```

---

## 🗄️ Configuration Supabase pour la Production

### 1. Autoriser le Domaine Vercel dans Supabase

1. Dans Supabase, allez dans **Authentication** → **URL Configuration**
2. Ajoutez vos URLs Vercel dans **Site URL** :
   ```
   https://medreputation.vercel.app
   ```

3. Dans **Redirect URLs**, ajoutez :
   ```
   https://medreputation.vercel.app/**
   ```

### 2. Configurer les CORS (si nécessaire)

Supabase autorise automatiquement les requêtes depuis n'importe quel domaine avec la clé `anon`. Pas de configuration supplémentaire nécessaire !

### 3. Vérifier les Policies RLS (Row Level Security)

Assurez-vous que vos tables ont des politiques RLS activées :

```sql
-- Exemple pour la table 'practices'
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture
CREATE POLICY "Allow read access to all users" 
ON practices FOR SELECT 
USING (true);

-- Politique pour permettre l'écriture aux utilisateurs authentifiés
CREATE POLICY "Allow insert for authenticated users" 
ON practices FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 🧪 Tester Votre Déploiement

### Checklist de Test

- [ ] **Page d'accueil** : https://medreputation.vercel.app charge correctement
- [ ] **Authentification** : Login/Signup fonctionne
- [ ] **Connexion Supabase** : Les données s'affichent
- [ ] **Navigation** : Toutes les routes SPA fonctionnent (pas d'erreur 404)
- [ ] **Responsive** : Tester sur mobile
- [ ] **Performance** : Lighthouse score > 90

### Déboguer les Erreurs

#### Erreur : "Failed to fetch data from Supabase"
- ✅ Vérifiez que les variables d'environnement sont bien définies dans Vercel
- ✅ Vérifiez que l'URL Supabase est correcte (sans `/` à la fin)
- ✅ Vérifiez que la clé anon est correcte

#### Erreur : 404 sur les routes
- ✅ Vérifiez que `vercel.json` est bien dans le dossier `medreputation-react`
- ✅ Vérifiez que le Root Directory est bien `medreputation-react`

#### Variables d'environnement non chargées
- ✅ Les variables doivent commencer par `VITE_` pour Vite
- ✅ Redéployez après avoir ajouté les variables

---

## 🎯 Liens Utiles

| Ressource | Lien |
|-----------|------|
| **Votre Repo GitHub** | https://github.com/FontoXx/MedReputation |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Supabase Dashboard** | https://supabase.com/dashboard |
| **Documentation Vercel** | https://vercel.com/docs |
| **Documentation Vite** | https://vitejs.dev/guide/build.html |

---

## 🚨 Notes Importantes

### Limitations du Plan Gratuit Vercel

- ✅ **Bande passante** : 100 GB/mois
- ✅ **Builds** : 100 heures/mois
- ✅ **Domaines** : Illimité
- ✅ **SSL** : Inclus automatiquement
- ✅ **CDN** : Global (rapide partout)

### Backend FastAPI **NON DÉPLOYÉ**

⚠️ **Important** : Vercel est pour le **frontend uniquement**. 

Votre backend FastAPI (avec Ollama/IA) nécessite un hébergement séparé :

**Options pour le Backend :**
1. **Render.com** (gratuit avec limitations)
2. **Railway.app** (gratuit 500h/mois)
3. **Fly.io** (gratuit avec limitations)
4. **VPS OVH/Scaleway** (payant ~3€/mois)

**Alternative Simple** : Désactiver les fonctionnalités IA sur la version déployée et garder seulement Supabase pour les données.

---

## 📝 Checklist Finale

Avant de déployer, vérifiez :

- [ ] ✅ Code poussé sur GitHub
- [ ] ✅ Variables d'environnement configurées dans Vercel
- [ ] ✅ Root Directory = `medreputation-react`
- [ ] ✅ Supabase configuré avec les bonnes URLs
- [ ] ✅ RLS policies activées sur Supabase
- [ ] ✅ Domaine Vercel autorisé dans Supabase Authentication

---

## 🎉 Résultat Final

Une fois déployé, vous aurez :

- ✅ **URL publique** : https://medreputation.vercel.app
- ✅ **SSL/HTTPS** : Automatique
- ✅ **Déploiement automatique** : À chaque push sur `main`
- ✅ **Préviews** : Pour chaque Pull Request
- ✅ **CDN Global** : Chargement rapide partout

---

**Prêt à déployer ?** 🚀

Suivez les étapes ci-dessus et votre application sera en ligne en moins de 10 minutes !
