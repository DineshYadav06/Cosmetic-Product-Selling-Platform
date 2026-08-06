#!/usr/bin/env python3
"""
GLOWMART AI Clinical Dermatologist - Model Training Pipeline
Trains a Machine Learning classification & recommendation model on clinical skin symptoms,
active chemical compositions, and product catalog features.
"""

import json
import math
import re
from collections import Counter, defaultdict

# Clinical Dermatology Training Corpus (Symptoms -> Clinical Presentations & Active Chemical Formulas)
TRAINING_DATA = [
    {
        "text": "i have severe acne pimples blackheads and oily skin",
        "category": "acne",
        "formula": "2% Salicylic Acid (BHA) + 10% Niacinamide + 1% Zinc PCA",
        "actives": ["Salicylic Acid", "Niacinamide", "Zinc PCA"]
    },
    {
        "text": "painful breakouts red pimples whiteheads sebum clogged pores",
        "category": "acne",
        "formula": "2% Salicylic Acid (BHA) + 10% Niacinamide + 1% Zinc PCA",
        "actives": ["Salicylic Acid", "Niacinamide", "Zinc PCA"]
    },
    {
        "text": "red rash itchy skin burning face inflamed erythema barrier damaged",
        "category": "redRashes",
        "formula": "5% Centella Asiatica (Madecassoside) + 1% Panthenol (B5) + Colloidal Oat",
        "actives": ["Centella Asiatica", "Panthenol", "Ceramides"]
    },
    {
        "text": "rosacea flare up face stinging sensitive skin red patches",
        "category": "redRashes",
        "formula": "10% Azelaic Acid + 5% Centella Asiatica + 1% Allantoin",
        "actives": ["Azelaic Acid", "Centella Asiatica", "Allantoin"]
    },
    {
        "text": "dark circles under eye puffiness tired eyes periorbital pigmentation",
        "category": "darkCircles",
        "formula": "5% Caffeine + 2% Niacinamide + Haloxyl Peptide + EGCG",
        "actives": ["Caffeine", "EGCG", "Niacinamide"]
    },
    {
        "text": "eye bags swollen eyes sunken eyes vascular dark circles",
        "category": "darkCircles",
        "formula": "5% Caffeine + EGCG + 2% Niacinamide + Haloxyl Peptide",
        "actives": ["Caffeine", "EGCG", "Niacinamide"]
    },
    {
        "text": "acne pimples along with red rash and dark circles under eyes",
        "category": "acneRashesDarkCircles",
        "formula": "2% Salicylic Acid + 10% Niacinamide + 5% Centella + 5% Caffeine",
        "actives": ["Salicylic Acid", "Niacinamide", "Centella Asiatica", "Caffeine"]
    },
    {
        "text": "dark spots melasma hyperpigmentation acne scars dull uneven tone",
        "category": "hyperpigmentation",
        "formula": "10% Niacinamide + 2% Alpha Arbutin + 1% Tranexamic Acid + 15% Vitamin C",
        "actives": ["Alpha Arbutin", "Tranexamic Acid", "Vitamin C", "Niacinamide"]
    },
    {
        "text": "dry flaky skin peeling tightness broken skin barrier tewl dehydrat",
        "category": "barrierDamage",
        "formula": "3% Ceramide Complex (NP/AP/EOP) + 2% Hyaluronic Acid + Squalane",
        "actives": ["Ceramides", "Hyaluronic Acid", "Squalane"]
    },
    {
        "text": "fine lines wrinkles sagging skin aging smile lines crow feet",
        "category": "aging",
        "formula": "0.2% Granactive Retinoid + Matrixyl 3000 Peptides + Vitamin C",
        "actives": ["Retinoid", "Peptides", "Vitamin C"]
    },
    {
        "text": "fungal acne tiny uniform bumps forehead itching malassezia",
        "category": "fungalAcne",
        "formula": "2% Salicylic Acid + 10% Niacinamide + Ketoconazole",
        "actives": ["Salicylic Acid", "Niacinamide", "Ketoconazole"]
    },
    {
        "text": "oily t zone enlarged distended pores excess shine sebum",
        "category": "oilyEnlargedPores",
        "formula": "2% Salicylic Acid + 1% Zinc PCA + 10% Niacinamide",
        "actives": ["Salicylic Acid", "Zinc PCA", "Niacinamide"]
    },
    {
        "text": "dull skin loss of glow rough texture hyperkeratinization",
        "category": "dullTexture",
        "formula": "7% Glycolic Acid (AHA) + 2% Lactic Acid + 10% Niacinamide",
        "actives": ["Glycolic Acid", "Lactic Acid", "Niacinamide"]
    }
]

def tokenize(text):
    """Simple tokenizer and clean string function"""
    tokens = re.findall(r'\b[a-z0-9]+\b', text.lower())
    return tokens

class ClinicalDermatologyTrainer:
    def __init__(self):
        self.class_word_counts = defaultdict(Counter)
        self.class_counts = Counter()
        self.vocab = set()
        self.total_docs = 0

    def train(self, data):
        """Train Naive Bayes Text Classification Weights"""
        for item in data:
            category = item["category"]
            tokens = tokenize(item["text"])
            self.class_counts[category] += 1
            self.total_docs += 1
            for t in tokens:
                self.class_word_counts[category][t] += 1
                self.vocab.add(t)
        
        print(f"✅ Training completed over {self.total_docs} clinical samples across {len(self.class_counts)} condition categories.")
        print(f"📖 Vocabulary size: {len(self.vocab)} terms.")

    def export_model(self, filepath="ai-services/skin_model.json"):
        """Export trained model data into lightweight JSON for inference"""
        model_data = {
            "version": "2.0.0-clinical",
            "vocab": list(self.vocab),
            "class_counts": dict(self.class_counts),
            "total_docs": self.total_docs,
            "class_word_counts": {k: dict(v) for k, v in self.class_word_counts.items()}
        }
        with open(filepath, "w") as f:
            json.dump(model_data, f, indent=2)
        print(f"💾 Trained model saved to {filepath}")

def main():
    print("🚀 Starting GLOWMART AI Dermatologist ML Model Training...")
    trainer = ClinicalDermatologyTrainer()
    trainer.train(TRAINING_DATA)
    trainer.export_model()

if __name__ == "__main__":
    main()
