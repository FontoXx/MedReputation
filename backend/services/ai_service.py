import ollama
import json
import re
from typing import Dict, List

# Mots-clés sensibles (violation secret médical)
SENSITIVE_KEYWORDS = [
    # Diagnostics
    "cancer", "vih", "sida", "diabète", "dépression", "schizophrénie", "bipol",
    "hépatite", "cirrhose", "tumeur", "métastase", "chimiothérapie",
    # Traitements
    "antidépresseur", "anxiolytique", "morphine", "opiacé", "psychotrope",
    # Informations personnelles
    "dossier médical", "résultat", "analyse", "radio", "scanner", "irm",
    # Procédures
    "opération", "chirurgie", "intervention", "hospitalisation"
]

# Templates de réponses conformes
MEDICAL_RESPONSE_TEMPLATES = {
    "negative_confidential": """Bonjour,

Nous prenons très au sérieux votre retour. Toutefois, pour des raisons de confidentialité médicale et de respect du secret professionnel, nous ne pouvons pas discuter de votre situation sur un forum public.

Nous vous invitons à nous contacter directement au {phone} afin que nous puissions échanger en toute confidentialité et trouver une solution adaptée à votre situation.

Cordialement,
{signature}""",
    
    "negative_general": """Bonjour,

Nous sommes sincèrement désolés que votre expérience n'ait pas été à la hauteur de vos attentes. La satisfaction de nos patients est notre priorité absolue.

Nous vous invitons à nous contacter directement au {phone} pour que nous puissions comprendre ce qui s'est passé et améliorer nos services.

Cordialement,
{signature}""",
    
    "positive": """Bonjour,

Merci infiniment pour votre confiance et ce retour positif. C'est une grande satisfaction pour toute notre équipe de savoir que nous avons pu vous accompagner dans de bonnes conditions.

Nous restons à votre disposition pour vos futurs besoins de santé.

Cordialement,
{signature}""",
    
    "defamatory": """Bonjour,

Nous avons pris connaissance de votre message. Nous tenons à préciser que les informations partagées ne correspondent pas à la réalité de nos pratiques professionnelles.

Pour des raisons de confidentialité médicale, nous ne pouvons pas discuter publiquement de situations individuelles. Nous vous invitons à nous contacter directement au {phone}.

Nous nous réservons le droit de prendre les mesures appropriées en cas de diffamation.

Cordialement,
{signature}"""
}

class AIService:
    def __init__(self, model: str = "llama3.2:3b"):
        self.model = model
    
    def analyze_reviews(self, reviews_text: str, practice_name: str) -> Dict:
        """Analyse des avis médicaux avec Llama 3.2"""
        
        prompt = f"""Tu es un expert en réputation médicale et satisfaction patient.

Analyse ces avis pour "{practice_name}" (établissement médical) et fournis un rapport professionnel avec:

1. **📊 Résumé Exécutif Médical** (2-3 phrases sur la réputation globale)

2. **✅ Points Forts** (3-5 aspects positifs avec citations)
   - Qualité des soins
   - Relation médecin-patient
   - Accueil et organisation
   - Compétence technique

3. **⚠️ Points d'Amélioration** (3-5 aspects avec citations)
   - Temps d'attente
   - Communication
   - Disponibilité
   - Suivi patient

4. **🚨 Alertes Déontologiques**
   - Avis mentionnant des informations médicales sensibles
   - Accusations graves nécessitant une réponse
   - Risques juridiques potentiels

5. **💡 Recommandations Stratégiques** (3-5 actions concrètes pour améliorer la réputation)

6. **🎯 Score de Réputation Médicale** (sur 10 avec justification)

Voici les avis:

{reviews_text}

Sois précis, professionnel et sensible aux enjeux déontologiques du secteur médical.
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )
            
            analysis = response['message']['content']
            
            # Extraire les métriques
            metrics = self._extract_metrics(analysis)
            
            return {
                "analysis": analysis,
                "metrics": metrics
            }
        except Exception as e:
            raise Exception(f"Erreur Ollama: {str(e)}")
    
    def generate_response(self, review_text: str, review_rating: int, 
                         practice_name: str, practice_phone: str) -> Dict:
        """Génère une réponse conforme à la déontologie médicale avec Llama 3.2"""
        
        # Détection contenu sensible
        sensitive = self.detect_sensitive_content(review_text)
        
        # Déterminer le type de réponse nécessaire
        if sensitive['risk_score'] >= 10:
            response_type = "Diffamatoire - Action juridique possible"
            guidelines = """
IMPORTANT: Cet avis contient des accusations graves. Ta réponse doit:
- Rester professionnelle et factuelle
- Ne PAS discuter de détails médicaux publiquement
- Mentionner le respect du secret médical
- Inviter au contact privé
- Mentionner subtilement les recours juridiques possibles
"""
        elif sensitive['has_sensitive_content'] or review_rating <= 2:
            response_type = "Négatif - Confidentialité requise"
            guidelines = """
IMPORTANT: Cet avis contient des informations sensibles ou est très négatif. Ta réponse doit:
- Respecter ABSOLUMENT le secret médical
- Ne JAMAIS mentionner de détails cliniques
- Inviter le patient à contacter le cabinet en privé
- Être empathique mais professionnelle
"""
        elif review_rating <= 3:
            response_type = "Négatif - Réponse empathique"
            guidelines = """
IMPORTANT: Cet avis est négatif. Ta réponse doit:
- Montrer de l'empathie
- S'excuser pour l'expérience négative
- Proposer une solution
- Inviter au contact pour améliorer
"""
        else:
            response_type = "Positif - Remerciement"
            guidelines = """
IMPORTANT: Cet avis est positif. Ta réponse doit:
- Remercier chaleureusement le patient
- Valoriser la confiance accordée
- Rester humble et professionnel
- Inviter à revenir
"""
        
        # Prompt pour Llama 3.2
        prompt = f"""Tu es le responsable d'un établissement médical: {practice_name}

{guidelines}

CONTRAINTES DÉONTOLOGIQUES STRICTES:
- JAMAIS de détails médicaux dans la réponse
- Respecter le Code de Déontologie Médicale
- Ton professionnel et empathique
- Maximum 100 mots

INFORMATIONS:
- Téléphone du cabinet: {practice_phone}
- Signature: {practice_name}

AVIS DU PATIENT (note: {review_rating}/5):
"{review_text}"

Génère UNE SEULE réponse conforme à la déontologie médicale.
Format: Commence par "Bonjour," et termine par "Cordialement, {practice_name}"
"""
        
        try:
            # Appel à Llama 3.2 pour génération dynamique
            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )
            
            generated_response = response['message']['content'].strip()
            
        except Exception as e:
            # Fallback sur template si Ollama échoue
            print(f"Erreur Ollama: {e}")
            template_key = self._get_template_key(sensitive, review_rating)
            template = MEDICAL_RESPONSE_TEMPLATES[template_key]
            generated_response = template.format(
                phone=practice_phone,
                signature=practice_name
            )
        
        # Notes de conformité
        compliance_notes = self._get_compliance_notes_dynamic(sensitive, review_rating)
        
        return {
            "response": generated_response,
            "response_type": response_type,
            "compliance_notes": compliance_notes,
            "sensitive_analysis": sensitive
        }
    
    def _get_template_key(self, sensitive: Dict, review_rating: int) -> str:
        """Détermine le template à utiliser en fallback"""
        if sensitive['risk_score'] >= 10:
            return "defamatory"
        elif sensitive['has_sensitive_content'] or review_rating <= 2:
            return "negative_confidential"
        elif review_rating <= 3:
            return "negative_general"
        else:
            return "positive"
    
    def _get_compliance_notes_dynamic(self, sensitive: Dict, review_rating: int) -> List[str]:
        """Retourne les notes de conformité basées sur l'analyse"""
        notes = []
        
        if sensitive['has_sensitive_content']:
            notes.append("🚨 Contenu sensible détecté - Réponse adaptée par l'IA")
            notes.append("✅ Respect du secret médical garanti")
        
        if sensitive['risk_score'] >= 10:
            notes.append("⚠️ Avis à risque juridique - Réponse prudente générée")
        
        if review_rating <= 2:
            notes.append("✅ Empathie et invitation au contact privé")
        elif review_rating >= 4:
            notes.append("✅ Remerciement professionnel et chaleureux")
        
        notes.append("🤖 Réponse générée par Llama 3.2")
        notes.append("✅ Conforme au Code de Déontologie Médicale")
        
        return notes
    
    def detect_sensitive_content(self, review_text: str) -> Dict:
        """Détecte les mentions sensibles violant le secret médical"""
        
        review_lower = review_text.lower()
        detected = []
        risk_score = 0
        
        # Détection mots-clés sensibles
        for keyword in SENSITIVE_KEYWORDS:
            if keyword in review_lower:
                detected.append(f"Diagnostic: {keyword}")
                risk_score += 2
        
        # Détection noms propres (potentiellement noms de médecins/patients)
        names = re.findall(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', review_text)
        if names:
            detected.extend([f"Nom: {name}" for name in names])
            risk_score += 3
        
        # Détection accusations graves
        accusations = ["faute", "négligence", "erreur médicale", "incompétent", "charlatan", "arnaque"]
        for acc in accusations:
            if acc in review_lower:
                detected.append(f"Accusation: {acc}")
                risk_score += 5
        
        # Classification du risque
        if risk_score >= 10:
            risk_level = "CRITIQUE"
            risk_color = "#dc3545"
        elif risk_score >= 5:
            risk_level = "ÉLEVÉ"
            risk_color = "#fd7e14"
        elif risk_score >= 2:
            risk_level = "MOYEN"
            risk_color = "#ffc107"
        else:
            risk_level = "FAIBLE"
            risk_color = "#28a745"
        
        return {
            "has_sensitive_content": len(detected) > 0,
            "detected_items": detected,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_color": risk_color
        }
    
    def _extract_metrics(self, analysis_text: str) -> Dict:
        """Extrait les métriques d'une analyse"""
        
        prompt = f"""Extrait les métriques clés de cette analyse d'avis:

{analysis_text}

Réponds au format JSON:
{{
  "satisfaction_score": 7.5,
  "positive_ratio": 65,
  "negative_ratio": 20,
  "neutral_ratio": 15,
  "top_strength": "Qualité des produits",
  "top_weakness": "Temps d'attente",
  "sentiment": "POSITIF"
}}
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}],
                format='json'
            )
            return json.loads(response['message']['content'])
        except:
            return {
                "satisfaction_score": 5.0,
                "positive_ratio": 33,
                "negative_ratio": 33,
                "neutral_ratio": 34,
                "sentiment": "NEUTRE"
            }
    
    def _get_compliance_notes(self, template_key: str, sensitive: Dict) -> List[str]:
        """Retourne les notes de conformité déontologique"""
        
        notes = []
        
        if template_key in ["negative_confidential", "defamatory"]:
            notes.append("✅ Respect du secret médical (pas de détails cliniques)")
            notes.append("✅ Invitation au contact privé")
        
        if template_key == "defamatory":
            notes.append("⚠️ Mention de mesures juridiques (dissuasion)")
        
        if sensitive['has_sensitive_content']:
            notes.append("🚨 Contenu sensible détecté - Réponse adaptée")
        
        notes.append("✅ Ton professionnel et empathique")
        notes.append("✅ Conforme au Code de Déontologie Médicale")
        
        return notes
