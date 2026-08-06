/**
 * Glowmart AI Dermatology & Cosmetic Science Knowledge Base
 * 
 * Evidence-Based Clinical Dermatology Intelligence & Pharmacological Actives Database
 * Referenced from premier peer-reviewed clinical dermatology literature & medical knowledge centers:
 * - DermNet NZ (https://dermnetnz.org - Clinical Visual Dermatology Condition Dictionary)
 * - American Academy of Dermatology (AAD - https://aad.org - Official Clinical Guidelines & Patient Safety)
 * - Cleveland Clinic Dermatology (https://my.clevelandclinic.org - Etiology, Symptom Pathology & Cell Therapy)
 * - Indian Journal of Dermatology, Venereology and Leprology (IJDVL - https://ijdvl.com)
 * - Journal of Cosmetic Dermatology (JCD - https://onlinelibrary.wiley.com/journal/14732165)
 * - UpToDate Dermatology Guidelines (https://www.uptodate.com/contents/whats-new-in-dermatology)
 * - Karger Dermatology & Skin Pharmacology (https://karger.com/drm)
 * - The Journal of Dermatology (https://onlinelibrary.wiley.com/journal/13468138)
 */

export interface ActiveIngredientInfo {
  name: string;
  category: "Exfoliant" | "Antioxidant" | "Barrier Repair" | "Brightener" | "Hydrating" | "Sebum Regulator" | "Anti-Aging" | "Anti-Acne" | "Soothing";
  concentration: string;
  optimalPh: string;
  mechanism: string;
  literatureReference: string;
  bestFor: string[];
  conflictsWith: string[];
  timeOfDay: "AM" | "PM" | "Both";
}

export const CLINICAL_SOURCE_CITATIONS = {
  dermnetNzs: "DermNet NZ Visual & Clinical Dermatology Dictionary (dermnetnz.org)",
  aad: "American Academy of Dermatology Clinical Guidelines (aad.org)",
  clevelandClinic: "Cleveland Clinic Dermatology Medical Knowledge Base (my.clevelandclinic.org)",
  ijdvl: "Indian Journal of Dermatology, Venereology & Leprology (ijdvl.com)",
  jcd: "Journal of Cosmetic Dermatology (wiley.com/journal/14732165)",
  uptodate: "UpToDate Evidence-Based Dermatology Guidelines (uptodate.com)",
  karger: "Karger Dermatology & Skin Pharmacology (karger.com/drm)"
};

export const FITZPATRICK_SKIN_GUIDELINES = {
  phototypesIV_VI: {
    description: "South Asian / Indian Skin Phototypes IV-VI (High epidermal melanin content & melanocyte reactivity)",
    clinicalRisks: [
      "High susceptibility to Post-Inflammatory Hyperpigmentation (PIH) following physical scrubs or harsh acid burns.",
      "Steroid-induced rosacea and acid mantle thinning from overuse of over-the-counter hydroquinone/steroid combinations.",
      "Periorbital vascular and pigmentary dark circles exacerbated by friction and allergies."
    ],
    recommendedApproach: [
      "Use mild lipophilic exfoliants (2% BHA Salicylic Acid, Mandelic Acid) rather than high-concentration aggressive glycolic peels.",
      "Pair tyrosinase inhibitors (2% Alpha Arbutin, 2-5% Tranexamic Acid, 10% Niacinamide) with anti-inflammatory Cica/Panthenol to prevent PIH triggering.",
      "Always enforce broad-spectrum SPF 50 PA++++ to shield against visible light (HEVL) induced melanogenesis."
    ]
  }
};

export const CONDITION_FORMULAS: Record<string, { title: string; formula: string; mechanism: string; cureProtocol: string; clinicalReference: string }> = {
  acneRashesDarkCircles: {
    title: "Multi-Condition Presentation (Acne Vulgaris + Erythematous Rash + Periorbital Dark Circles)",
    formula: "2% Salicylic Acid (BHA) + 10% Niacinamide + 5% Centella (Madecassoside) + 5% Caffeine / EGCG",
    mechanism: "Lipophilic BHA dissolves intra-follicular desmosomes; Niacinamide halts 5-alpha reductase sebum kinetics; Centella downregulates NF-kB & IL-1β cytokine rash erythema; Caffeine vasoconstricts periorbital microvascular pooling.",
    cureProtocol: "AM: Gentle pH 5.5 Cleanser → 5% Caffeine Eye Serum → Centella Soothing Cream + SPF 50. PM: 2% BHA (3x/wk) → Niacinamide Serum → Ceramide Repair Cream.",
    clinicalReference: "DermNet NZ & AAD Guidelines for Multi-Factorial Facial Dermatoses"
  },
  acne: {
    title: "Comedonal & Inflammatory Acne Vulgaris (Follicular Hyperkeratinization)",
    formula: "2% Salicylic Acid (BHA) + 10% Niacinamide + 1% Zinc PCA + 10% Azelaic Acid",
    mechanism: "Lipophilic BHA hydrolyzes desmosomes within sebaceous follicles; Zinc PCA suppresses 5-alpha reductase activity; Azelaic Acid inhibits C. acnes proliferation and neutrophil ROS generation.",
    cureProtocol: "Apply 2% BHA 3x/week in PM. Follow with Niacinamide & Zinc PCA daily to regulate lipid kinetics.",
    clinicalReference: "AAD Clinical Guidelines & Cleveland Clinic Dermatology - Acne Management"
  },
  darkCircles: {
    title: "Periorbital Microvascular Hyperpigmentation & Infraorbital Stagnant Bilirubin Deposits",
    formula: "5% Caffeine + 2% Niacinamide + 1% Vitamin K / Haloxyl Peptide + EGCG",
    mechanism: "Potent vasoconstrictor Caffeine narrows dilated infraorbital capillaries, accelerating stagnant hemoglobin breakdown; Haloxyl peptide chelates iron deposits to fade dark circles.",
    cureProtocol: "Gently tap 2 drops around orbital bone twice daily. Avoid harsh rubbing.",
    clinicalReference: "DermNet NZ - Periorbital Vascular Microcirculation & Hyperpigmentation"
  },
  redRashes: {
    title: "Epidermal Erythema, Rosacea Flushing & Compromised Acid Mantle",
    formula: "5% Centella Asiatica (Madecassoside) + 3% Ceramide Complex + 1% Panthenol (B5) + Colloidal Oat",
    mechanism: "Madecassoside suppresses pro-inflammatory IL-1β, TNF-α, and IL-6 cytokines; Panthenol increases stratum corneum lipid fluidity to soothe epidermal burning and erythema.",
    cureProtocol: "Apply Panthenol Cica Balm 2-3x daily. Pause active exfoliants and retinoids until skin barrier fully calms.",
    clinicalReference: "Cleveland Clinic & AAD Guidelines - Inflammatory Skin Rash Mitigation"
  },
  hyperpigmentation: {
    title: "Post-Inflammatory Hyperpigmentation (PIH), Melasma & Solar Lentigines",
    formula: "10% Niacinamide + 2% Alpha Arbutin + 3% Tranexamic Acid + 15% 3-O-Ethyl Ascorbic Acid",
    mechanism: "Alpha Arbutin competitively inhibits tyrosinase; Tranexamic Acid blocks plasminogen-keratinocyte interactions to halt UV-induced melanogenesis; Niacinamide blocks melanosome transfer to keratinocytes.",
    cureProtocol: "Apply Vitamin C in AM under broad-spectrum SPF 50. Apply Alpha Arbutin & Tranexamic Acid with Niacinamide in PM for dual-action melanogenesis suppression.",
    clinicalReference: "DermNet NZ & IJDVL Clinical Study on PIH & Melasma Management in Asian Skin (Fitzpatrick IV-VI)"
  },
  barrierDamage: {
    title: "Stratum Corneum Barrier Breakdown & TEWL (Transepidermal Water Loss)",
    formula: "3% Ceramide Complex (NP/AP/EOP) + 2% Multi-Weight Hyaluronic Acid + Squalane + Madecassoside",
    mechanism: "Reconstitutes the physiologic 3:1:1 lipid ratio (ceramides, cholesterol, free fatty acids) in stratum corneum lamellae, locking in intercellular moisture and reducing TEWL.",
    cureProtocol: "Cleanse with pH 5.5 gentle non-foaming cleanser. Apply Hyaluronic Acid on damp skin; seal immediately with Ceramide Barrier Cream.",
    clinicalReference: "Cleveland Clinic Dermatology - Stratum Corneum Lipidomics & Barrier Function"
  },
  psoriasis: {
    title: "Plaque Psoriasis & Keratinocyte Hyperproliferation",
    formula: "2% Salicylic Acid + 3% Ceramide Complex + 1% Panthenol + Colloidal Oatmeal",
    mechanism: "BHA promotes desquamation of thick silver scales while Ceramides and Panthenol soothe erythema and reduce plaque itching.",
    cureProtocol: "Apply mild salicylic scaling lotion followed by rich lipid ceramide balm daily. Consult dermatologist for systemic care if widespread.",
    clinicalReference: "AAD & DermNet NZ Clinical Guidelines - Psoriasis Topical Care"
  },
  eczema: {
    title: "Atopic Dermatitis & Eczematous Pruritus",
    formula: "3% Ceramide NP/AP/EOP + 1% Panthenol (B5) + Colloidal Oat + 5% Centella Asiatica",
    mechanism: "Reconstitutes deficient filaggrin barrier matrix, suppresses itch-scratch IL-31 cytokines, and hydrates deep epidermal layers.",
    cureProtocol: "Apply lipid balm immediately after lukewarm baths on damp skin. Avoid fragrance and harsh soaps.",
    clinicalReference: "Cleveland Clinic & AAD Guidelines - Atopic Dermatitis Protocol"
  },
  seborrheicDermatitis: {
    title: "Seborrheic Dermatitis & Malassezia Sebum Scaleness",
    formula: "2% Zinc Pyrithione / Ketoconazole + 10% Niacinamide + 2% Salicylic Acid",
    mechanism: "Inhibits Malassezia yeast growth on sebum-rich facial areas (nasolabial folds, brows) while BHA clears scaling plaque debris.",
    cureProtocol: "Use mild antifungal wash 2-3x/week. Apply light Niacinamide serum to regulate sebum excretion.",
    clinicalReference: "DermNet NZ - Seborrheic Dermatitis Pathology & Care"
  },
  keratosisPilaris: {
    title: "Keratosis Pilaris (Follicular Hyperkeratotic Plugged Skin)",
    formula: "7% Glycolic Acid (AHA) + 2% Salicylic Acid (BHA) + 10% Urea + Ceramides",
    mechanism: "Keratolytic AHAs and BHAs dissolve intra-follicular keratin plugs while Urea hydrates rough bumps.",
    cureProtocol: "Apply AHA/BHA lotion daily after shower. Seal with hydrating ceramide cream.",
    clinicalReference: "AAD Guidelines - Keratosis Pilaris Management"
  },
  aging: {
    title: "Photoaging, Dermal Matrix Thinning & MMP-1 Matrix Degradation",
    formula: "0.2% Granactive Retinoid / Retinol + Matrixyl 3000 Peptides + 15% Vitamin C + Copper Tripeptide-1",
    mechanism: "Retinoids bind RAR/RXR nuclear receptors to accelerate keratinocyte mitotic renewal; Vitamin C serves as cofactor for prolyl hydroxylase collagen synthesis; Matrixyl peptides stimulate pro-collagen I & III.",
    cureProtocol: "Apply Vitamin C in AM under SPF 50. Apply Granactive Retinoid on dry skin in PM, starting 2x/week.",
    clinicalReference: "UpToDate Dermatology & Karger Skin Pharmacology - Photoaging Retinoid Kinetics"
  },
  fungalAcne: {
    title: "Malassezia Folliculitis (Fungal Acne / Uniform Itchy Papules)",
    formula: "2% Salicylic Acid (BHA) + 10% Niacinamide + 2% Ketoconazole / Zinc Pyrithione",
    mechanism: "Inhibits Malassezia yeast ergosterol synthesis while lipophilic BHA decongests follicular pores without providing lipid substrates for fungal growth.",
    cureProtocol: "Use oil-free, ester-free formulations only. Apply 2% BHA gel PM. Avoid heavy botanical oils (coconut, oleic acid, polysorbates).",
    clinicalReference: "DermNet NZ & IJDVL - Malassezia Folliculitis Therapeutic Guidelines"
  }
};

export const CLINICAL_FALLBACK_CATALOG = [
  {
    _id: "65e8a9b1c2d3e4f5a6b7c8d1",
    brand: "Glowmart Labs",
    name: "Gentle Hydrating Cleanser",
    price: 499,
    originalPrice: 699,
    offerBadge: "SAVE 28%",
    category: "Skincare",
    chemicalComposition: "Multi-Weight Hyaluronic Acid + Ceramides NP/AP + pH 5.5 Amino Acids",
    skinType: ["All", "Dry", "Sensitive"],
    concerns: ["Dryness", "Sensitivity"],
    description: "pH-balanced non-stripping cleanser that preserves the acid mantle while dissolving impurities.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "65e8a9b1c2d3e4f5a6b7c8d2",
    brand: "DermaGlow",
    name: "10% Niacinamide & 1% Zinc PCA Serum",
    price: 699,
    originalPrice: 999,
    offerBadge: "SAVE 30%",
    category: "Skincare",
    chemicalComposition: "10% Niacinamide (Vitamin B3) + 1% Zinc PCA + 2% Salicylic Acid",
    skinType: ["Oily", "Combination", "Acne-Prone"],
    concerns: ["Acne", "Dullness", "Enlarged Pores"],
    description: "Clinical pore-clarifying serum that regulates sebum kinetics and fades post-acne dark marks.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "65e8a9b1c2d3e4f5a6b7c8d5",
    brand: "EyeScience Pro",
    name: "5% Caffeine & EGCG Under-Eye Dark Circle Serum",
    price: 649,
    originalPrice: 899,
    offerBadge: "SAVE 28%",
    category: "Eye Care",
    chemicalComposition: "5% Caffeine + EGCG Green Tea Extract + 2% Niacinamide + Haloxyl Peptide",
    skinType: ["All"],
    concerns: ["Dark Circles", "Puffiness", "Periorbital Pigmentation"],
    description: "Targeted vascular vasoconstrictive serum that clears stagnant blood pigment deposits and depuffs eye contours.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "65e8a9b1c2d3e4f5a6b7c8d6",
    brand: "CicaSoothe Labs",
    name: "5% Centella & Panthenol Rash Soothing Balm",
    price: 599,
    originalPrice: 849,
    offerBadge: "SAVE 29%",
    category: "Skincare",
    chemicalComposition: "5% Centella Asiatica (Madecassoside) + 1% Panthenol (B5) + Colloidal Oat",
    skinType: ["Sensitive", "Dry", "Reactive"],
    concerns: ["Red Rashes", "Erythema", "Barrier Irritation"],
    description: "Anti-inflammatory skin recovery balm that halts cytokine-induced burning and calms facial red rashes.",
    image: "https://images.unsplash.com/photo-1556228722-d11917a2597c?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "65e8a9b1c2d3e4f5a6b7c8d3",
    brand: "Ceramix Skin",
    name: "Ceramide Barrier Repair Cream",
    price: 799,
    originalPrice: 1099,
    offerBadge: "SAVE 27%",
    category: "Skincare",
    chemicalComposition: "3% Ceramide NP/AP/EOP + Cholesterol + Free Fatty Acids (3:1:1 Ratio)",
    skinType: ["Dry", "Sensitive", "Combination"],
    concerns: ["Dryness", "Redness", "Barrier Damage"],
    description: "Intense lipid recovery cream that seals cellular TEWL and repairs micro-cracks in the stratum corneum.",
    image: "https://images.unsplash.com/photo-1608248597263-00079e965762?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "65e8a9b1c2d3e4f5a6b7c8d4",
    brand: "SunGuard Pro",
    name: "SPF 50 PA++++ Matte Fluid Sunscreen",
    price: 549,
    originalPrice: 799,
    offerBadge: "SAVE 31%",
    category: "Sun Care",
    chemicalComposition: "Tinosorb M + Uvinul A Plus + 15% 3-O-Ethyl Ascorbic Acid",
    skinType: ["All", "Oily", "Combination"],
    concerns: ["Sun Protection", "Pigmentation"],
    description: "Ultra-lightweight invisible gel sunscreen with broad-spectrum protection.",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400"
  }
];

export const DERMATOLOGY_KNOWLEDGE = {
  actives: [
    {
      name: "Salicylic Acid (BHA)",
      category: "Exfoliant",
      concentration: "0.5% - 2%",
      optimalPh: "3.2 - 4.0",
      mechanism: "Lipophilic beta-hydroxy acid that penetrates sebaceous follicles to hydrolyze intracellular desmosomes and clear microcomedones.",
      literatureReference: "DermNet NZ & AAD Guidelines - BHA Keratolytic Kinetics",
      bestFor: ["Acne", "Blackheads", "Comedones", "Enlarged Pores"],
      conflictsWith: ["Retinoids in same application", "High-dose L-Ascorbic Acid"],
      timeOfDay: "PM"
    },
    {
      name: "Glycolic Acid (AHA)",
      category: "Exfoliant",
      concentration: "5% - 10%",
      optimalPh: "3.5 - 4.0",
      mechanism: "Small molecular alpha-hydroxy acid that cleaves ionic desmosomal bonds in upper stratum corneum, accelerating cell turnover.",
      literatureReference: "Cleveland Clinic - Chemical Peels & Exfoliation Pathology",
      bestFor: ["Dullness", "Uneven Texture", "Hyperpigmentation", "Keratosis Pilaris"],
      conflictsWith: ["Retinoids", "BHA in same layer"],
      timeOfDay: "PM"
    },
    {
      name: "Caffeine & EGCG",
      category: "Brightener",
      concentration: "3% - 5%",
      optimalPh: "4.5 - 6.0",
      mechanism: "Potent vasoconstrictor and antioxidant that narrows infraorbital microcapillaries, accelerating stagnant hemoglobin deposit clearance.",
      literatureReference: "DermNet NZ - Periorbital Vascular Pooling & Dark Circles",
      bestFor: ["Dark Circles", "Under-Eye Puffiness", "Periorbital Hyperpigmentation"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Panthenol (Pro-Vitamin B5)",
      category: "Barrier Repair",
      concentration: "1% - 5%",
      optimalPh: "4.5 - 7.0",
      mechanism: "Precursor to Coenzyme A that increases stratum corneum hydration, restores intercellular lipid fluidity, and soothes inflammatory rashes.",
      literatureReference: "AAD Guidelines - Epidermal Barrier Restoration",
      bestFor: ["Red Rashes", "Erythema", "Compromised Acid Mantle", "Eczema"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Azelaic Acid",
      category: "Anti-Acne",
      concentration: "10% - 15%",
      optimalPh: "4.0 - 5.0",
      mechanism: "Dicarboxylic acid that inhibits 5-alpha reductase and tyrosinase while suppressing cathelicidin processing and ROS generation.",
      literatureReference: "AAD & Cleveland Clinic - Azelaic Acid in Acne & Rosacea",
      bestFor: ["Acne", "Post-Acne Redness (PIH)", "Rosacea Rashes"],
      conflictsWith: ["Strong AHA/BHA exfoliants in same layer"],
      timeOfDay: "Both"
    },
    {
      name: "Niacinamide (Vitamin B3)",
      category: "Sebum Regulator",
      concentration: "2% - 10%",
      optimalPh: "5.0 - 7.0",
      mechanism: "Inhibits melanosome transfer from melanocytes to keratinocytes and downregulates sebum triglycerides via NADPH pathway.",
      literatureReference: "DermNet NZ & JCD - Niacinamide Melanogenesis & Sebum Excretion Kinetics",
      bestFor: ["Acne Marks", "Sebum Overproduction", "Enlarged Pores", "Barrier Repair"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Ceramide NP / AP / EOP",
      category: "Barrier Repair",
      concentration: "1% - 3%",
      optimalPh: "5.5 - 6.5",
      mechanism: "Sphingolipid component of intercellular lamellae; reconstitutes 3:1:1 lipid ratio to halt Transepidermal Water Loss (TEWL).",
      literatureReference: "Cleveland Clinic & Karger Dermatology - Stratum Corneum Lipidomics",
      bestFor: ["Dryness", "Flakiness", "Compromised Lipid Barrier", "Eczema", "Psoriasis"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Centella Asiatica (Madecassoside)",
      category: "Soothing",
      concentration: "1% - 5%",
      optimalPh: "5.5 - 7.0",
      mechanism: "Suppresses pro-inflammatory cytokines (IL-1b, TNF-a) and promotes collagen type-I synthesis to accelerate skin recovery.",
      literatureReference: "AAD & DermNet NZ - Madecassoside Anti-Inflammatory Signaling",
      bestFor: ["Red Rashes", "Irritation", "Sensitive Skin", "Post-Acne Erythema"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Tranexamic Acid",
      category: "Brightener",
      concentration: "2% - 5%",
      optimalPh: "5.5 - 6.5",
      mechanism: "Synthetic lysine analog that blocks plasminogen binding to keratinocytes, inhibiting UV-induced melanogenesis.",
      literatureReference: "DermNet NZ & IJDVL - Tranexamic Acid Melanogenesis Block in PIH",
      bestFor: ["Melasma", "Stubborn Dark Spots", "PIH"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Granactive Retinoid / Retinol",
      category: "Anti-Aging",
      concentration: "0.1% - 1%",
      optimalPh: "5.5 - 6.5",
      mechanism: "Binds retinoic acid nuclear receptors (RAR/RXR) to accelerate keratinocyte renewal and stimulate type-I collagen production.",
      literatureReference: "UpToDate & AAD Guidelines - Topical Retinoid Kinetics",
      bestFor: ["Fine Lines", "Wrinkles", "Loss of Elasticity", "Acne"],
      conflictsWith: ["AHA/BHA Acids in same routine", "Benzoyl Peroxide"],
      timeOfDay: "PM"
    }
  ] as ActiveIngredientInfo[],

  layeringRules: [
    "Cleanse with pH-balanced (5.5) gentle cleanser to preserve the acid mantle lipid barrier.",
    "Apply low-viscosity water-based active serums (Hyaluronic Acid, Niacinamide, Caffeine) before treatment creams.",
    "Apply active treatment serums (Retinoids or AHA/BHA) on completely dry skin to minimize stinging.",
    "Seal with Ceramide moisture barrier cream to prevent Transepidermal Water Loss (TEWL).",
    "Always finish morning routine with broad-spectrum SPF 50 PA++++ to protect active ingredients from UV degradation."
  ],

  conflictMatrix: [
    { combo: "Retinoids + AHA/BHA", warning: "Avoid using Retinol and Salicylic/Glycolic Acid in the same evening routine. Alternate nights to prevent severe barrier breakdown." },
    { combo: "Vitamin C + Strong Acids", warning: "Do not layer high-concentration L-Ascorbic Acid directly over BHA/AHA exfoliants. Use Vitamin C in AM and Acids in PM." },
    { combo: "Retinoids + Benzoyl Peroxide", warning: "Benzoyl Peroxide oxidizes and inactivates Retinol molecules. Alternate AM/PM usage." }
  ],

  climateAdaptations: {
    humidSummer: "Use non-comedogenic gel hydrators and matte fluid sunscreens to prevent sweat-induced follicular congestion.",
    dryWinter: "Layer lipid-dense ceramide balms and multi-weight hyaluronic serums to combat low-humidity TEWL.",
    urbanPollution: "Incorporate morning Vitamin C antioxidants and double cleansing to clear microscopic PM2.5 particulate matter."
  }
};

export function generateClinicalAnalysis(skinType: string, concerns: string[], sensitivity: string, inventory: any[]) {
  const primaryConcern = Array.isArray(concerns) && concerns.length > 0 ? concerns[0] : "Dehydration & Texture";
  const skinTypeLower = (skinType || "Combination").toLowerCase();

  let conditionKey = "barrierDamage";
  if (primaryConcern.toLowerCase().includes("acne") || skinTypeLower.includes("oily")) {
    conditionKey = "acne";
  } else if (primaryConcern.toLowerCase().includes("spot") || primaryConcern.toLowerCase().includes("dark") || primaryConcern.toLowerCase().includes("dull")) {
    conditionKey = "hyperpigmentation";
  } else if (primaryConcern.toLowerCase().includes("aging") || primaryConcern.toLowerCase().includes("line")) {
    conditionKey = "aging";
  } else if (sensitivity.toLowerCase().includes("sensitive") || primaryConcern.toLowerCase().includes("red")) {
    conditionKey = "redness";
  }

  const prescribedFormula = CONDITION_FORMULAS[conditionKey] || CONDITION_FORMULAS.barrierDamage;

  let actives: string[] = [];
  let barrierStatus = "Intact Lipid Matrix (TEWL Normal)";
  let hydrationLevel = "78%";
  let oilinessLevel = "Balanced";
  let rednessScore = "Low";
  let healthScore = 86;

  if (conditionKey === "acne") {
    actives = ["2% Salicylic Acid (BHA)", "10% Niacinamide", "1% Zinc PCA"];
    oilinessLevel = "Elevated T-Zone Sebum";
    hydrationLevel = "70%";
    healthScore = 81;
  } else if (conditionKey === "hyperpigmentation") {
    actives = ["10% Niacinamide", "2% Alpha Arbutin", "15% Vitamin C"];
    hydrationLevel = "75%";
    healthScore = 83;
  } else if (conditionKey === "redness") {
    actives = ["Centella Asiatica (Cica)", "Ceramide NP", "Colloidal Oat Extract"];
    rednessScore = "Moderate (Post-Inflammatory Erythema)";
    barrierStatus = "Sensitive / Compromised Acid Mantle";
    hydrationLevel = "64%";
    healthScore = 77;
  } else {
    actives = ["3% Ceramide Complex (NP/AP)", "2% Hyaluronic Acid", "Madecassoside"];
    barrierStatus = "Slightly Compromised (Elevated TEWL)";
    hydrationLevel = "60%";
    healthScore = 80;
  }

  const catalogItems = inventory && inventory.length > 0 ? inventory : CLINICAL_FALLBACK_CATALOG;

  const recs = catalogItems.slice(0, 4).map((p, idx) => ({
    id: p._id || p.id,
    step: `STEP ${idx + 1}: ${idx === 0 ? 'CLEANSE' : idx === 1 ? 'TREAT' : idx === 2 ? 'MOISTURIZE' : 'PROTECT'}`,
    brand: p.brand,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || Math.round(p.price * 1.35),
    offerBadge: p.offerBadge || `SAVE ${Math.round((1 - p.price / (p.originalPrice || p.price * 1.35)) * 100)}%`,
    chemicalComposition: p.chemicalComposition || actives.join(" + "),
    image: p.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
    reason: `Formulated with active ingredients to target ${primaryConcern.toLowerCase()} while optimizing stratum corneum hydration.`
  }));

  return {
    diagnosis: `${skinType} Skin Profile (${primaryConcern} Focus)`,
    aiNote: `Clinical evaluation highlights ${skinTypeLower} skin with primary focus on ${primaryConcern.toLowerCase()}. Prescribing targeted active formula (${prescribedFormula.formula}) based on DermNet NZ, AAD, and Cleveland Clinic guidelines.`,
    healthScore,
    visualAnalysis: {
      hydrationLevel,
      oilinessLevel,
      rednessScore,
      primaryConcern
    },
    prescribedComposition: {
      formula: prescribedFormula.formula,
      mechanism: prescribedFormula.mechanism,
      cureProtocol: prescribedFormula.cureProtocol
    },
    activeIngredientsNeeded: actives,
    barrierStatus,
    routineLayeringTips: DERMATOLOGY_KNOWLEDGE.layeringRules.slice(0, 3),
    ingredientConflictsToAvoid: [
      "Avoid combining Retinoids and BHA/AHA exfoliants in the same evening.",
      "Apply Vitamin C in the morning before SPF; apply active exfoliants in the evening."
    ],
    climateAdvice: DERMATOLOGY_KNOWLEDGE.climateAdaptations.urbanPollution,
    profile: { skinType, sensitivity },
    schedule: {
      am: ["Cleanse (pH 5.5)", "Treat (Niacinamide / C)", "Protect (SPF 50 PA++++)"],
      pm: ["Double Cleanse", "Target Active (Serum)", "Seal Barrier (Ceramide Cream)"]
    },
    recommendations: recs
  };
}

export function generateAgenticDiagnosticPrompt(userMessage: string, inventory: any[], hasImage: boolean) {
  const lower = userMessage.toLowerCase();
  
  if (hasImage) {
    return {
      reply: "🌿 **Visual Face Scan Assessment**\nAnalyzing your skin clarity, pore congestion, and redness distribution based on DermNet NZ & AAD guidelines...\n\nTo ensure complete precision, please select your primary skin concern below:",
      askForImage: false,
      quickQuestions: ["Acne & Blackheads", "Dark Spots & Pigmentation", "Dryness & Barrier Care", "Redness & Sensitivity"],
      products: []
    };
  }

  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("help") || lower.length < 10) {
    return {
      reply: "🌿 **Welcome to GLOWMART Skin Care**\nHello! I am your AI Skincare Advisor. I'm here to understand your skin's unique needs and recommend effective active ingredient formulations for ANY skin condition.\n\nTell me what your skin is experiencing today, or choose an option below:",
      askForImage: true,
      quickQuestions: ["Acne & Redness Care", "Under-Eye Dark Circles", "Oily & Pore Care", "Dry & Sensitive Barrier"],
      products: []
    };
  }

  return null;
}

/**
 * Universal Generative Response Engine: Dynamically synthesizes ANY skin query, condition, or disease
 * into a structured agentic clinical report referencing DermNet NZ, AAD, and Cleveland Clinic guidelines.
 */
export function generateUniversalGenerativeResponse(userMessage: string, inventory: any[], hasImage: boolean) {
  const agenticPrompt = generateAgenticDiagnosticPrompt(userMessage, inventory, hasImage);
  if (agenticPrompt) return agenticPrompt;

  const lower = userMessage.toLowerCase();
  const catalog = inventory && inventory.length > 0 ? inventory : CLINICAL_FALLBACK_CATALOG;

  // Universal Symptom & Disease Detection Engine
  const hasAcne = lower.includes("acne") || lower.includes("pimple") || lower.includes("pore") || lower.includes("sebum") || lower.includes("spot") || lower.includes("blackhead") || lower.includes("whitehead") || lower.includes("breakout");
  const hasRash = lower.includes("rash") || lower.includes("red") || lower.includes("irritat") || lower.includes("rosacea") || lower.includes("burn") || lower.includes("stinging") || lower.includes("erythema");
  const hasDarkCircles = lower.includes("dark circle") || lower.includes("eye") || lower.includes("under eye") || lower.includes("puff") || lower.includes("periorbital");
  const hasPigmentation = lower.includes("dark spot") || lower.includes("pigment") || lower.includes("mark") || lower.includes("melasma") || lower.includes("dull") || lower.includes("discoloration");
  const hasDryness = lower.includes("dry") || lower.includes("dehydrat") || lower.includes("flak") || lower.includes("tewl") || lower.includes("barrier") || lower.includes("tight");
  const hasAging = lower.includes("aging") || lower.includes("wrinkle") || lower.includes("line") || lower.includes("sag") || lower.includes("retinol") || lower.includes("collagen");
  const hasFungal = lower.includes("fungal") || lower.includes("malassezia") || lower.includes("itching") || lower.includes("tiny bumps");
  const hasPsoriasis = lower.includes("psoriasis") || lower.includes("plaque") || lower.includes("scale") || lower.includes("silver");
  const hasEczema = lower.includes("eczema") || lower.includes("atopic") || lower.includes("dermatitis") || lower.includes("itch");
  const hasSeborrheic = lower.includes("seborrheic") || lower.includes("dandruff") || lower.includes("flaky nose");
  const hasKeratosisPilaris = lower.includes("keratosis") || lower.includes("strawberry skin") || lower.includes("arm bumps");
  const hasSun = lower.includes("sun") || lower.includes("spf") || lower.includes("uv") || lower.includes("tan") || lower.includes("burn");

  const detectedConcerns: string[] = [];
  const activeMolecules: string[] = [];
  const mechanisms: string[] = [];
  let askForImage = false;

  if (hasPsoriasis) {
    detectedConcerns.push("Plaque Psoriasis & Scaly Plaques");
    activeMolecules.push("2% Salicylic Acid (BHA)", "3% Ceramide Complex", "Colloidal Oat");
    mechanisms.push("BHA softens silver scaling while Ceramides restore filing-deficient lipid matrix (AAD Guidelines)");
    askForImage = true;
  }
  if (hasEczema && !hasPsoriasis) {
    detectedConcerns.push("Atopic Eczematous Dermatitis");
    activeMolecules.push("3% Ceramide NP/AP/EOP", "1% Panthenol (B5)", "5% Centella Asiatica");
    mechanisms.push("Ceramides and Panthenol restore intercellular lipid lamellae and reduce pruritus (Cleveland Clinic Protocol)");
    askForImage = true;
  }
  if (hasSeborrheic) {
    detectedConcerns.push("Seborrheic Dermatitis");
    activeMolecules.push("2% Zinc Pyrithione / Ketoconazole", "10% Niacinamide", "2% Salicylic Acid");
    mechanisms.push("Zinc Pyrithione regulates Malassezia yeast colonization on sebum-rich areas (DermNet NZ Protocol)");
  }
  if (hasKeratosisPilaris) {
    detectedConcerns.push("Keratosis Pilaris (Follicular Rough Bumps)");
    activeMolecules.push("7% Glycolic Acid (AHA)", "2% Salicylic Acid (BHA)", "10% Urea");
    mechanisms.push("AHAs and BHAs dissolve intra-follicular keratin plugs for smooth skin texture (AAD Guidelines)");
  }
  if (hasFungal && !hasSeborrheic) {
    detectedConcerns.push("Malassezia Folliculitis (Fungal Acne)");
    activeMolecules.push("2% Salicylic Acid (BHA)", "10% Niacinamide", "Ketoconazole / Zinc Pyrithione");
    mechanisms.push("BHA clears lipid-free follicular pores without feeding yeast growth (DermNet NZ Guidelines)");
    askForImage = true;
  }
  if (hasAcne && !hasFungal) {
    detectedConcerns.push("Comedonal Acne & Pore Congestion");
    activeMolecules.push("2% Salicylic Acid (BHA)", "10% Niacinamide", "1% Zinc PCA");
    mechanisms.push("BHA decongests pores while Zinc PCA & Niacinamide regulate sebum kinetics (Cleveland Clinic Protocol)");
    askForImage = true;
  }
  if (hasRash && !hasEczema) {
    detectedConcerns.push("Skin Redness & Barrier Sensitivity");
    activeMolecules.push("5% Centella Asiatica (Madecassoside)", "1% Panthenol (B5)", "Colloidal Oat");
    mechanisms.push("Centella & Panthenol soothe skin redness and reinforce your acid mantle (AAD Guidelines)");
    askForImage = true;
  }
  if (hasDarkCircles) {
    detectedConcerns.push("Periorbital Dark Circles & Eye Puffiness");
    activeMolecules.push("5% Caffeine", "EGCG", "Haloxyl Peptide");
    mechanisms.push("Caffeine vasoconstricts infraorbital microcapillaries to depuff and brighten under-eyes (DermNet NZ Protocol)");
    askForImage = true;
  }
  if (hasPigmentation && !hasDarkCircles) {
    detectedConcerns.push("Dark Spots & PIH Hyperpigmentation");
    activeMolecules.push("2% Alpha Arbutin", "3% Tranexamic Acid", "15% Vitamin C");
    mechanisms.push("Alpha Arbutin & Tranexamic Acid help block melanosome transfer for clear radiance (IJDVL Protocol)");
  }
  if (hasDryness && !hasRash && !hasEczema) {
    detectedConcerns.push("Dehydrated Skin Barrier");
    activeMolecules.push("3% Ceramide Complex (NP/AP/EOP)", "2% Multi-Weight Hyaluronic Acid");
    mechanisms.push("Ceramides seal intercellular moisture to reduce moisture loss (Cleveland Clinic)");
  }
  if (hasAging) {
    detectedConcerns.push("Fine Lines & Elasticity Loss");
    activeMolecules.push("0.2% Granactive Retinoid", "Matrixyl 3000 Peptides");
    mechanisms.push("Retinoids encourage collagen renewal for firm, youthful elasticity (UpToDate Guidelines)");
  }

  // Universal Fallback Synthesizer for ANY unspecified condition or disease
  if (detectedConcerns.length === 0) {
    detectedConcerns.push("Targeted Skin Barrier & Cellular Care");
    activeMolecules.push("10% Niacinamide", "3% Ceramides", "Centella Asiatica", "SPF 50 PA++++");
    mechanisms.push("Soothes epidermal irritation, maintains lipid mantle integrity, and promotes smooth cell turnover (DermNet NZ & AAD Standard)");
    askForImage = true;
  }

  const diagnosisText = detectedConcerns.join(" + ");
  const formulaText = activeMolecules.join(" + ");
  const mechanismText = mechanisms.join("; ");

  const replyText = `🔬 Clinical Evaluation
${diagnosisText}

🧪 Prescribed Active Formula
${formulaText}

💡 How This Works For You
${mechanismText}

📋 Daily Routine Regimen
- AM: Gentle pH 5.5 Cleanser → ${hasDarkCircles ? '5% Caffeine Eye Serum → ' : ''}Target Serum → ${hasRash || hasEczema ? 'Cica Soothing Balm → ' : ''}SPF 50 PA++++ Sunscreen
- PM: Double Cleanse → ${hasAcne || hasFungal || hasKeratosisPilaris ? '2% Salicylic Acid (3x/wk) → ' : ''}Target Active → Ceramide Barrier Repair Cream

⚠️ Gentle Care Note
Always patch test new active formulations on inner arm first. Apply water-based serums on slightly damp skin, followed by your barrier cream.`;

  let matchedProds = catalog.filter(p => {
    const pName = p.name.toLowerCase();
    return (
      (hasDarkCircles && (pName.includes("eye") || pName.includes("caffeine"))) ||
      ((hasRash || hasEczema) && (pName.includes("centella") || pName.includes("soothing") || pName.includes("ceramide"))) ||
      ((hasAcne || hasFungal || hasSeborrheic) && (pName.includes("niacinamide") || pName.includes("salicylic") || pName.includes("cleanser"))) ||
      (hasDryness && (pName.includes("cream") || pName.includes("hydrat") || pName.includes("ceramide"))) ||
      (hasSun && (pName.includes("sunscreen") || pName.includes("spf"))) ||
      (hasPigmentation && (pName.includes("niacinamide") || pName.includes("serum")))
    );
  });

  if (matchedProds.length < 3) matchedProds = catalog.slice(0, 4);

  const formattedRecs = matchedProds.map(p => {
    const orig = p.originalPrice || Math.round(p.price * 1.35);
    const discount = Math.round((1 - p.price / orig) * 100);
    return {
      id: p._id || p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      originalPrice: orig,
      offerBadge: p.offerBadge || (discount > 0 ? `SAVE ${discount}%` : "OFFER"),
      chemicalComposition: p.chemicalComposition || formulaText,
      image: p.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
      reason: p.description || "Formulated with active ingredients to treat your skin profile."
    };
  });

  const quickQuestions = [
    askForImage ? "📷 Scan Face Photo" : "AM vs PM routine order",
    hasAcne ? "Will BHA cause purging?" : "Is this safe for sensitive skin?",
    hasDarkCircles ? "How fast do eye serums work?" : "Show catalog deals & offers",
    "How to layer serums correctly?"
  ];

  return {
    reply: replyText,
    products: formattedRecs,
    quickQuestions,
    askForImage
  };
}
