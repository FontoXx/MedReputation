# 🏥 MedReputation - Healthcare Reputation Manager

Interface React moderne et professionnelle pour la gestion de réputation médicale.

## 🎯 Fonctionnalités

### KPIs Médicaux
- **Indice de Confiance Patient** (0-100)
- **Taux de Sentiment Négatif** avec alertes
- **Délai de Réponse Moyen**
- **Mots-clés Critiques** détectés

### AI Medical Guard
- Détection automatique de contenus sensibles
- Identification des diagnostics médicaux
- Repérage des noms de praticiens
- Alertes de risque juridique

### Smart Reply Tool
- Génération de réponses Medical-Safe
- Conformité déontologique garantie
- Respect du secret médical
- Templates pré-validés

### Interface Professionnelle
- Design épuré et sécurisant
- Palette médicale (bleu émeraude)
- Typographie claire (Inter)
- Ombres et bordures douces

## 🚀 Installation

```bash
cd medreputation-react
npm install
npm run dev
```

L'application sera accessible sur http://localhost:5173

## 📁 Structure

```
src/
├── components/
│   ├── StatCard.jsx      # KPIs médicaux
│   ├── Sidebar.jsx       # Navigation + sélecteur cabinet
│   ├── Header.jsx        # Veille médicale
│   └── ReviewRow.jsx     # Avis + AI Guard + Smart Reply
├── App.jsx               # Application principale
└── index.css             # Styles Tailwind
```

## 🎨 Design System

### Couleurs
- **Medical Primary**: #0d9488 (Bleu émeraude)
- **Background**: #f8fafc (Blanc cassé)
- **Sidebar**: #1e293b (Slate foncé)
- **Accents**: Dégradés subtils

### Typographie
- **Font**: Inter (Google Fonts)
- **Espacement**: Généreux pour lisibilité
- **Poids**: 300-800

## 🔧 Technologies

- **React** 18
- **Vite** 7
- **Tailwind CSS** 3
- **Lucide Icons**

## 📊 Données de Démo

L'application contient des données de démonstration pour tester toutes les fonctionnalités :
- 3 avis (positif, négatif, critique)
- 1 avis avec contenu sensible
- KPIs simulés

## 🎯 Prochaines Étapes

1. Intégrer l'API backend (Python/Ollama)
2. Ajouter authentification
3. Implémenter pages supplémentaires :
   - Alertes de Réputation
   - Modèles de Réponses
   - Rapports de Conformité
4. Ajouter graphiques (Chart.js)
5. Mode sombre optionnel

## 📝 Notes

- Interface optimisée pour le secteur médical
- Conformité déontologique prioritaire
- Design professionnel et sécurisant
- Code propre et modulaire

---

Made with ❤️ for healthcare professionals
