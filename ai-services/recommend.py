#!/usr/bin/env python3
"""
GLOWMART AI Clinical Dermatologist - Recommendation & Prediction Engine
Loads the trained ML model (`skin_model.json`) and performs Naive Bayes text classification &
chemical composition synthesis for user skin queries.
"""

import sys
import json
import math
import re

CONDITION_PRESCRIBED_FORMULAS = {
    "acne": {
        "diagnosis": "Comedonal Acne Vulgaris & Follicular Sebum Overproduction",
        "formula": "2% Salicylic Acid (BHA) + 10% Niacinamide + 1% Zinc PCA",
        "mechanism": "Lipophilic BHA dissolves intra-follicular desmosomes; Zinc PCA suppresses 5-alpha reductase enzyme kinetics."
    },
    "redRashes": {
        "diagnosis": "Epidermal Erythema & Compromised Acid Mantle Rash",
        "formula": "5% Centella Asiatica (Madecassoside) + 1% Panthenol (B5) + Colloidal Oat",
        "mechanism": "Downregulates pro-inflammatory IL-1β cytokines and restores intercellular lipid lamellae."
    },
    "darkCircles": {
        "diagnosis": "Periorbital Microvascular Hyperpigmentation & Infraorbital Fluid Pooling",
        "formula": "5% Caffeine + 2% Niacinamide + Haloxyl Peptide + EGCG",
        "mechanism": "Vasoconstricts dilated infraorbital microcapillaries and accelerates stagnant blood pigment clearance."
    },
    "acneRashesDarkCircles": {
        "diagnosis": "Multi-Condition Presentation (Acne + Inflamed Rash + Dark Circles)",
        "formula": "2% Salicylic Acid + 10% Niacinamide + 5% Centella + 5% Caffeine",
        "mechanism": "BHA clears follicular plugs; Centella calms cytokine rash erythema; Caffeine narrows infraorbital microvessels."
    },
    "hyperpigmentation": {
        "diagnosis": "Post-Inflammatory Hyperpigmentation (PIH) & Melasma",
        "formula": "10% Niacinamide + 2% Alpha Arbutin + 1% Tranexamic Acid + 15% Vitamin C",
        "mechanism": "Inhibits tyrosinase enzymatic activity and blocks melanosome transfer to keratinocytes."
    },
    "barrierDamage": {
        "diagnosis": "Stratum Corneum Barrier Breakdown & Elevated TEWL",
        "formula": "3% Ceramide Complex (NP/AP/EOP) + 2% Hyaluronic Acid + Madecassoside",
        "mechanism": "Reconstitutes 3:1:1 lipid ratio in intercellular matrix to halt Transepidermal Water Loss."
    },
    "aging": {
        "diagnosis": "Photoaging & Dermal Matrix Thinning",
        "formula": "0.2% Granactive Retinoid + Matrixyl 3000 Peptides + Vitamin C",
        "mechanism": "Retinoids bind RAR/RXR nuclear receptors to stimulate type-I collagen synthesis."
    },
    "fungalAcne": {
        "diagnosis": "Malassezia Folliculitis (Fungal Acne)",
        "formula": "2% Salicylic Acid (BHA) + 10% Niacinamide + Ketoconazole / Zinc Pyrithione",
        "mechanism": "BHA clears lipid-free follicular pores without triggering Malassezia yeast growth."
    }
}

def tokenize(text):
    return re.findall(r'\b[a-z0-9]+\b', text.lower())

class ClinicalPredictor:
    def __init__(self, model_path="ai-services/skin_model.json"):
        with open(model_path, "r") as f:
            self.model = json.load(f)
        self.vocab = set(self.model["vocab"])
        self.class_counts = self.model["class_counts"]
        self.total_docs = self.model["total_docs"]
        self.class_word_counts = self.model["class_word_counts"]
        self.vocab_size = len(self.vocab)

    def predict(self, user_query):
        tokens = tokenize(user_query)
        scores = {}

        for category, doc_count in self.class_counts.items():
            # Prior log probability log P(C)
            prior = math.log(doc_count / float(self.total_docs))
            total_words_in_class = sum(self.class_word_counts[category].values())
            
            # Likelihood log P(W|C) with Laplace smoothing
            likelihood = 0.0
            for token in tokens:
                count = self.class_word_counts[category].get(token, 0)
                word_prob = (count + 1) / float(total_words_in_class + self.vocab_size)
                likelihood += math.log(word_prob)

            scores[category] = prior + likelihood

        best_category = max(scores, key=scores.get)
        prescription = CONDITION_PRESCRIBED_FORMULAS.get(best_category, CONDITION_PRESCRIBED_FORMULAS["acne"])

        return {
            "query": user_query,
            "predicted_category": best_category,
            "confidence_scores": scores,
            "clinical_diagnosis": prescription["diagnosis"],
            "prescribed_formula": prescription["formula"],
            "biochemical_mechanism": prescription["mechanism"]
        }

def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "i have acne pimples along with red rash and dark circles"

    predictor = ClinicalPredictor()
    result = predictor.predict(query)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
