# 🚀 Activation Supabase - Guide Rapide

## ✅ Connexion configurée !

Vos clés Supabase sont maintenant actives dans l'application.

### Prochaines étapes

#### 1. Créer les tables dans Supabase

1. Allez sur https://shestyxrlbjwvubeyqey.supabase.co
2. Cliquez sur **SQL Editor** dans le menu
3. Copiez tout le contenu de `database/schema.sql`
4. Collez dans l'éditeur SQL
5. Cliquez sur **Run** (▶️)
6. Attendez la confirmation "Success"

#### 2. Tester la connexion

Une fois les tables créées, votre application React devrait automatiquement :
- ✅ Se connecter à Supabase
- ✅ Afficher un état vide (normal, pas encore de données)
- ✅ Proposer "Créer données de test"

#### 3. Créer des données de test

Dans l'application web :
1. Cliquez sur **"Créer données de test"**
2. L'application va créer :
   - 1 cabinet médical (Cabinet Dr. Dupont)
   - 5 avis patients avec analyse IA
   - 1 rapport d'analyse
3. La page se rechargera automatiquement
4. Vous verrez le dashboard avec les vraies données !

## Vérification

Pour vérifier que tout fonctionne :

```bash
# Ouvrir la console du navigateur (F12)
# Vous devriez voir des logs comme :
# ✅ Cabinet créé: {...}
# ✅ 5 avis créés
# ✅ Rapport d'analyse créé
```

## Dépannage

### Si vous voyez "Aucun cabinet configuré"
✅ **C'est normal !** Les tables sont vides. Cliquez sur "Créer données de test".

### Si vous voyez une erreur de connexion
1. Vérifiez que les tables sont créées dans Supabase
2. Vérifiez le fichier `.env` (clés correctes)
3. Rechargez la page (Ctrl+R ou Cmd+R)

### Si npm run dev ne démarre pas
Le serveur devrait redémarrer automatiquement. Sinon :
```bash
cd medreputation-react
npm run dev
```

## Structure des données créées

### Cabinet
- Nom: Cabinet Dr. Dupont
- Adresse: 123 Rue de la Santé, 75014 Paris
- Téléphone: 01 23 45 67 89

### Avis (5 exemples)
- 2 avis positifs (5★, 4★)
- 1 avis neutre (3★)
- 2 avis critiques (2★, 1★)
- 1 avis avec contenu sensible détecté
- Tags automatiques (hygiène, attente, écoute, etc.)

### Statistiques générées
- Note moyenne: 3.4/5
- Taux négatif: 40%
- Trust Index: 87/100
- Top mots-clés: attente, écoute, professionnel

## 🎉 Prochain niveau

Une fois les données de test créées, vous pouvez :
- ✅ Voir le dashboard avec stats réelles
- ✅ Tester la recherche et les filtres
- ✅ Générer des réponses IA
- ✅ Archiver des avis
- ✅ Voir les pages Alertes, Templates, Rapports

Tout est prêt ! 🚀
