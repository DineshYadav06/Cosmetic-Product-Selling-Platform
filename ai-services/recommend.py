#!/usr/bin/env python3
"""
GLOWMART AI Clinical Dermatologist - Recommendation & Prediction Engine
Loads the universal evidence-based trained ML model (skin_model.json) and performs Naive Bayes text classification &
chemical composition synthesis for user skin queries referencing clinical literature (DermNet NZ, AAD, Cleveland Clinic, IJDVL, JCD, UpToDate, Karger, J. Derm).
"""

import sys
import json
import math
import re

CONDITION_PRESCRIBED_FORMULAS = {
    "acne": {
        "diagnosis": "Comedonal & Inflammatory Acne Vulgaris (Follicular Hyperkeratinization)",
        "formula": "2% Salicylic Acid (BHA) + 10% Niacinamide + 1% Zinc PCA + 10% Azelaic Acid",
        "mechanism": "Lipophilic BHA dissolves intra-follicular desmosomes; Zinc PCA suppresses 5-alpha reductase; Azelaic Acid inhibits C. acnes and ROS generation.",
        "literature_reference": "AAD Clinical Guidelines & Cleveland Clinic Dermatology - Acne Protocol"
    },
    "redRashes": {
        "diagnosis": "Epidermal Erythema, Rosacea Flushing & Compromised Acid Mantle",
        "formula": "5% Centella Asiatica (Madecassoside) + 1% Panthenol (B5) + Colloidal Oat",
        "mechanism": "Madecassoside suppresses pro-inflammatory IL-1β cytokines; Panthenol increases stratum corneum lipid fluidity to soothe redness.",
        "literature_reference": "Cleveland Clinic & DermNet NZ - Inflammatory Skin Rash Mitigation"
    },
    "psoriasis": {
        "diagnosis": "Plaque Psoriasis & Scaly Plaques",
        "formula": "2% Salicylic Acid + 3% Ceramide Complex + 1% Panthenol + Colloidal Oatmeal",
        "mechanism": "Salicylic acid softeners promote desquamation of thick silver scales while Ceramides restore lipid matrix.",
        "literature_reference": "AAD & DermNet NZ Clinical Guidelines - Psoriasis Topical Care"
    },
    "eczema": {
        "diagnosis": "Atopic Dermatitis & Eczematous Pruritus",
        "formula": "3% Ceramide NP/AP/EOP + 1% Panthenol (B5) + Colloidal Oat + 5% Centella Asiatica",
        "mechanism": "Reconstitutes deficient filaggrin barrier matrix, suppresses itch-scratch IL-31 cytokines, and hydrates deep epidermal layers.",
        "literature_reference": "Cleveland Clinic & AAD Guidelines - Atopic Dermatitis Protocol"
    },
    "seborrheicDermatitis": {
        "diagnosis": "Seborrheic Dermatitis & Malassezia Sebum Scaling",
        "formula": "2% Zinc Pyrithione / Ketoconazole + 10% Niacinamide + 2% Salicylic Acid",
        "mechanism": "Regulates Malassezia yeast colonization on sebum-rich facial areas while BHA clears scaling plaque debris.",
        "literature_reference": "DermNet NZ - Seborrheic Dermatitis Pathology & Care"
    },
    "keratosisPilaris": {
        "diagnosis": "Keratosis Pilaris (Follicular Keratin Plugs)",
        "formula": "7% Glycolic Acid (AHA) + 2% Salicylic Acid (BHA) + 10% Urea + Ceramides",
        "mechanism": "Keratolytic AHAs and BHAs dissolve intra-follicular keratin plugs for smooth skin texture.",
        "literature_reference": "AAD Guidelines - Keratosis Pilaris Management"
    },
    "darkCircles": {
        "diagnosis": "Periorbital Microvascular Hyperpigmentation & Stagnant Bilirubin Deposits",
        "formula": "5% Caffeine + 2% Niacinamide + Haloxyl Peptide + EGCG",
        "mechanism": "Vasoconstricts dilated infraorbital microcapillaries and accelerates stagnant blood deposit breakdown.",
        "literature_reference": "DermNet NZ - Periorbital Vascular Pooling & Dark Circles"
    },
    "acneRashesDarkCircles": {
        "diagnosis": "Multi-Condition Presentation (Acne + Inflamed Rash + Dark Circles)",
        "formula": "2% Salicylic Acid + 10% Niacinamide + 5% Centella + 5% Caffeine",
        "mechanism": "BHA clears follicular plugs; Centella calms cytokine rash erythema; Caffeine narrows infraorbital microvessels.",
        "literature_reference": "DermNet NZ & AAD Guidelines for Multi-Factorial Facial Dermatoses"
    },
    "hyperpigmentation": {
        "diagnosis": "Post-Inflammatory Hyperpigmentation (PIH) & Melasma",
        "formula": "10% Niacinamide + 2% Alpha Arbutin + 3% Tranexamic Acid + 15% Vitamin C",
        "mechanism": "Alpha Arbutin competitively inhibits tyrosinase; Tranexamic Acid blocks plasminogen-keratinocyte interactions to halt melanogenesis.",
        "literature_reference": "DermNet NZ & IJDVL Study on PIH & Melasma Management in Asian Skin (Fitzpatrick IV-VI)"
    },
    "barrierDamage": {
        "diagnosis": "Stratum Corneum Barrier Breakdown & TEWL (Transepidermal Water Loss)",
        "formula": "3% Ceramide Complex (NP/AP/EOP) + 2% Hyaluronic Acid + Squalane",
        "mechanism": "Reconstitutes physiologic 3:1:1 lipid ratio in stratum corneum lamellae to halt Transepidermal Water Loss.",
        "literature_reference": "Cleveland Clinic Dermatology - Stratum Corneum Lipidomics"
    },
    "aging": {
        "diagnosis": "Photoaging & MMP-1 Dermal Matrix Degradation",
        "formula": "0.2% Granactive Retinoid + Matrixyl 3000 Peptides + Vitamin C",
        "mechanism": "Retinoids activate nuclear RAR/RXR receptors to stimulate type-I collagen; Matrixyl peptides boost extracellular matrix.",
        "literature_reference": "UpToDate Dermatology & Karger Skin Pharmacology"
    },
    "fungalAcne": {
        "diagnosis": "Malassezia Folliculitis (Fungal Acne)",
        "formula": "2% Salicylic Acid (BHA) + 10% Niacinamide + Ketoconazole / Zinc Pyrithione",
        "mechanism": "BHA clears lipid-free follicular pores without triggering Malassezia yeast growth.",
        "literature_reference": "DermNet NZ & IJDVL - Malassezia Folliculitis Diagnostic & Therapeutic Guidelines"
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
            prior = math.log(doc_count / float(self.total_docs))
            total_words_in_class = sum(self.class_word_counts[category].values())
            
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
            "biochemical_mechanism": prescription["mechanism"],
            "literature_reference": prescription["literature_reference"]
        }

def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "psoriasis silver scaling plaques"

    predictor = ClinicalPredictor()
    result = predictor.predict(query)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
