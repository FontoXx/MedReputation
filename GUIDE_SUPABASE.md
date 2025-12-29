# 🚀 Guide d'Intégration Supabase

## Étape 1: Créer un Projet Supabase

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Conservez votre URL et votre clé anonyme (anon key)

## Étape 2: Créer les Tables

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez tout le contenu de `database/schema.sql`
3. Exécutez le script SQL
4. Vérifiez que les 6 tables sont créées :
   - `clinics`
   - `reviews`
   - `analysis_reports`
   - `alerts`
   - `response_templates`
   - `notification_settings`

## Étape 3: Configurer React

1. **Créer le fichier `.env`** (à la racine de medreputation-react)

```bash
cd medreputation-react
cp .env.example .env
```

2. **Remplir les variables d'environnement**

Éditez `.env` et ajoutez vos identifiants Supabase :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
```

3. **Installer les dépendances**

```bash
npm install @supabase/supabase-js
```

## Étape 4: Tester la Connexion

1. Lancez l'application :
```bash
npm run dev
```

2. Ouvrez la console du navigateur (F12)
3. Vous devriez voir les logs de connexion à Supabase

## Structure des Fichiers Créés

```
medreputation-react/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Client Supabase + Types
│   ├── hooks/
│   │   └── useSupabase.js       # Hooks React personnalisés
│   ├── services/
│   │   └── aiService.js         # Service d'analyse IA
│   └── components/
│       └── AddClinicForm.jsx    # Formulaire ajout cabinet
└── .env.example                  # Template config

database/
└── schema.sql                    # Schéma SQL complet
```

## Utilisation des Hooks

### 1. useClinicStats - Statistiques en temps réel

```javascript
import { useClinicStats } from '../hooks/useSupabase';

function Dashboard({ clinicId }) {
  const { 
    averageRating,
    negativeRate,
    topKeywords,
    trustIndex,
    loading,
    error 
  } = useClinicStats(clinicId);

  if (loading) return <div>Chargement...</div>;
  
  return (
    <div>
      <p>Note moyenne: {averageRating}/5</p>
      <p>Taux négatif: {negativeRate}%</p>
      <p>Indice de confiance: {trustIndex}/100</p>
    </div>
  );
}
```

### 2. useReviews - Liste des avis

```javascript
import { useReviews } from '../hooks/useSupabase';

function ReviewsList({ clinicId }) {
  const { reviews, loading, error } = useReviews(clinicId, {
    status: 'pending',
    isCritical: true
  });

  return (
    <div>
      {reviews.map(review => (
        <div key={review.id}>{review.text}</div>
      ))}
    </div>
  );
}
```

### 3. useClinics - Gestion des cabinets

```javascript
import { useClinics } from '../hooks/useSupabase';

function ClinicManager() {
  const { clinics, addClinic, deleteClinic } = useClinics();

  const handleAdd = async () => {
    await addClinic({
      name: 'Cabinet Dr. Dupont',
      address: '123 Rue',
      phone: '01 23 45 67 89'
    });
  };

  return <button onClick={handleAdd}>Ajouter</button>;
}
```

## Service d'Analyse IA

### Analyser un avis

```javascript
import { analyzeReviewWithAI } from '../services/aiService';

const analysis = await analyzeReviewWithAI(
  "Excellent médecin, très à l'écoute",
  5,
  { name: 'Cabinet Dr. Dupont', phone: '01 23 45 67 89' }
);

console.log(analysis);
// {
//   sentiment: 'Positif',
//   sentimentScore: 0.9,
//   tags: ['écoute', 'compétence', 'positif'],
//   isCritical: false,
//   suggestedResponse: "Bonjour,\n\nMerci..."
// }
```

## Sécurité - Row Level Security (RLS)

✅ Les policies RLS sont déjà configurées dans le schéma SQL

Chaque utilisateur ne peut voir que :
- Ses propres cabinets
- Les avis de ses cabinets
- Les rapports de ses cabinets

## Prochaines Étapes

1. ✅ Créer votre compte Supabase
2. ✅ Exécuter le script SQL
3. ✅ Configurer `.env`
4. ✅ Tester l'ajout d'un cabinet
5. 🔄 Connecter un scraper Google Maps
6. 🔄 Activer l'authentification Supabase

## Authentification (À venir)

Pour activer l'authentification :

```javascript
import { supabase } from './lib/supabase';

// Inscription
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Déconnexion
await supabase.auth.signOut();
```

## Support

💡 Docs Supabase: https://supabase.com/docs
🔧 Troubleshooting: Vérifier les logs dans Supabase Dashboard
