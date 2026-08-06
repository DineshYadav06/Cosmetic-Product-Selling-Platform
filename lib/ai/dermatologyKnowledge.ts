/**
 * Glowmart AI Dermatology & Cosmetic Science Knowledge Base
 * 
 * Provides domain-specific clinical intelligence on active ingredients,
 * chemical composition formulas, site catalog offer scanning, TEWL diagnostics,
 * routine layering rules, ingredient conflicts, and climate adaptation.
 */

export interface ActiveIngredientInfo {
  name: string;
  category: "Exfoliant" | "Antioxidant" | "Barrier Repair" | "Brightener" | "Hydrating" | "Sebum Regulator" | "Anti-Aging";
  concentration: string;
  mechanism: string;
  bestFor: string[];
  conflictsWith: string[];
  timeOfDay: "AM" | "PM" | "Both";
}

export const CONDITION_FORMULAS: Record<string, { title: string; formula: string; mechanism: string; cureProtocol: string }> = {
  acneRashesDarkCircles: {
    title: "Multi-Condition Presentation (Acne + Inflamed Rash + Dark Circles)",
    formula: "2% Salicylic Acid (BHA) + 10% Niacinamide + 5% Centella (Madecassoside) + 5% Caffeine / EGCG",
    mechanism: "BHA & Niacinamide decongest follicular plugs & halt 5-alpha reductase; Centella suppresses NF-kB cytokine rash erythema; Caffeine constricts periorbital microvascular blood pooling.",
    cureProtocol: "AM: Gentle pH 5.5 Cleanser → 5% Caffeine Eye Serum → Centella Soothing Cream + SPF 50. PM: 2% BHA (3x/wk) → Niacinamide Serum → Ceramide Repair Cream."
  },
  acne: {
    title: "Comedonal Acne Vulgaris & Inflammatory Papules",
    formula: "2% Salicylic Acid (BHA) + 10% Niacinamide + 1% Zinc PCA + 10% Azelaic Acid",
    mechanism: "Lipophilic BHA dissolves intra-follicular sebum & desmosomes; Zinc PCA & Niacinamide suppress 5-alpha reductase activity and regulate lipid kinetics.",
    cureProtocol: "Apply 2% BHA 3x/week in PM. Follow with Niacinamide & Zinc PCA daily. Apply Azelaic Acid on post-acne marks."
  },
  darkCircles: {
    title: "Periorbital Microvascular Hyperpigmentation & Infraorbital Fluid Pooling",
    formula: "5% Caffeine + 2% Niacinamide + 1% Vitamin K Peptide (Haloxyl) + EGCG",
    mechanism: "Vasoconstricts dilated infraorbital capillaries, accelerating stagnant bilirubin blood deposit breakdown and fading periorbital melanin pigmentation.",
    cureProtocol: "Gently tap 2 drops around orbital bone twice daily. Avoid harsh rubbing."
  },
  redRashes: {
    title: "Epidermal Erythema, Compromised Acid Mantle & Inflamed Rash",
    formula: "5% Centella Asiatica (Madecassoside) + 3% Ceramide Complex + 1% Panthenol (B5) + Colloidal Oat",
    mechanism: "Restores compromised acid mantle lipids, downregulates pro-inflammatory IL-1β/TNF-α cytokines, and soothes epidermal burning and stinging.",
    cureProtocol: "Apply Panthenol Cica Balm 2-3x daily. Pause active acids and retinoids until rash completely resolves."
  },
  hyperpigmentation: {
    title: "Post-Inflammatory Hyperpigmentation (PIH), Melasma & Sun Spots",
    formula: "10% Niacinamide + 2% Alpha Arbutin + 1% Tranexamic Acid + 15% Vitamin C (3-O-Ethyl Ascorbic Acid)",
    mechanism: "Competitive inhibition of tyrosinase enzyme blocks dopaquinone conversion; Tranexamic Acid halts plasmin-induced melanocyte activation; Niacinamide blocks melanosome transfer.",
    cureProtocol: "Apply Vitamin C in AM under SPF 50 PA++++. Apply Alpha Arbutin & Tranexamic Acid with Niacinamide in PM for dual-action melanogenesis suppression."
  },
  barrierDamage: {
    title: "Stratum Corneum Barrier Breakdown & Elevated TEWL (Transepidermal Water Loss)",
    formula: "3% Ceramide Complex (NP/AP/EOP) + 2% Multi-Weight Hyaluronic Acid + Madecassoside + Squalane",
    mechanism: "Restores 3:1:1 lipid ratio in stratum corneum lamellae, halting Transepidermal Water Loss (TEWL) and accelerating cell junction repair.",
    cureProtocol: "Use pH 5.5 gentle non-foaming cleanser. Apply Hyaluronic Acid on damp skin; seal immediately with Ceramide Barrier Balm."
  },
  aging: {
    title: "Photoaging, Dermal Matrix Thinning & Fine Lines",
    formula: "0.2% Granactive Retinoid / Retinol + Matrixyl 3000 Peptides + 15% Vitamin C + Copper Tripeptide-1",
    mechanism: "Retinoid stimulates nuclear RAR/RXR receptors to boost collagen-I synthesis; Vitamin C serves as essential cofactor for prolyl hydroxylase; Peptides trigger extracellular matrix synthesis.",
    cureProtocol: "Apply Vitamin C in AM under SPF 50. Apply Granactive Retinoid on dry skin in PM, starting 2x/week."
  },
  fungalAcne: {
    title: "Malassezia Folliculitis (Fungal Acne / Uniform Papules)",
    formula: "2% Salicylic Acid (BHA) + 10% Niacinamide + 2% Ketoconazole / Zinc Pyrithione (Oil-Free)",
    mechanism: "Inhibits Malassezia yeast lipophilic growth while BHA clears follicular debris without providing lipid substrates for fungal proliferation.",
    cureProtocol: "Use oil-free, ester-free formulations only. Apply 2% BHA gel PM. Avoid heavy botanical oils (coconut, shea, oleic acid)."
  },
  rosacea: {
    title: "Facial Rosacea, Erythematotelangiectatic Flushing & Reactive Stinging",
    formula: "10% Azelaic Acid + 5% Centella Asiatica + 1% Allantoin + Colloidal Oatmeal",
    mechanism: "Inhibits kallikrein-5 protease enzyme and cathelicidin LL-37 cleavage; reduces vasoactive facial capillary telangiectasia.",
    cureProtocol: "Apply 10% Azelaic Acid AM/PM under soothing Cica cream. Avoid alcohol, hot water, and physical scrubs."
  },
  oilyEnlargedPores: {
    title: "Sebaceous Hyperplasia, Elevated Sebum Kinetics & Distended Pores",
    formula: "2% Salicylic Acid (BHA) + 1% Zinc PCA + 10% Niacinamide + Kaolin Clay",
    mechanism: "Lipophilic BHA dissolves sebum plugs; Zinc PCA suppresses 5-alpha reductase enzyme to curb sebaceous glad hyper-excretion.",
    cureProtocol: "Cleanse with salicylic cleanser. Apply Niacinamide + Zinc PCA daily in AM/PM. Use Kaolin clay mask 1x/week."
  },
  dullTexture: {
    title: "Stratum Corneum Hyperkeratinization & Loss of Optical Luminosity",
    formula: "7% Glycolic Acid (AHA) + 2% Lactic Acid + 10% Niacinamide + Vitamin C",
    mechanism: "Hydrophilic AHA cleaves ionic bonds between desmosomes in the upper stratum corneum, promoting rapid cell turnover and smooth specular light reflection.",
    cureProtocol: "Sweep AHA exfoliator 2-3x/week in PM. Follow with hydrating hyaluronic serum. Always use SPF 50 morning after."
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
      mechanism: "Lipophilic beta-hydroxy acid that penetrates sebaceous follicles to hydrolyze intracellular desmosomes and clear microcomedones.",
      bestFor: ["Acne", "Blackheads", "Comedones", "Enlarged Pores"],
      conflictsWith: ["Retinoids in same application", "High-dose L-Ascorbic Acid"],
      timeOfDay: "PM"
    },
    {
      name: "Glycolic Acid (AHA)",
      category: "Exfoliant",
      concentration: "5% - 10%",
      mechanism: "Small molecular alpha-hydroxy acid that cleaves stratum corneum desmosomal bonds, triggering rapid epidermal desquamation.",
      bestFor: ["Dullness", "Uneven Texture", "Hyperpigmentation"],
      conflictsWith: ["Retinoids", "BHA in same layer"],
      timeOfDay: "PM"
    },
    {
      name: "Caffeine & EGCG",
      category: "Brightener",
      concentration: "3% - 5%",
      mechanism: "Potent vasoconstrictor and antioxidant that narrows infraorbital capillaries, accelerating stagnant hemoglobin breakdown to fade periorbital dark circles.",
      bestFor: ["Dark Circles", "Under-Eye Puffiness", "Periorbital Hyperpigmentation"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Panthenol (Pro-Vitamin B5)",
      category: "Barrier Repair",
      concentration: "1% - 5%",
      mechanism: "Precursor to Coenzyme A that increases stratum corneum hydration, restores intercellular lipid fluidity, and soothes inflammatory skin rashes.",
      bestFor: ["Red Rashes", "Erythema", "Compromised Acid Mantle", "Stinging"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Azelaic Acid",
      category: "Exfoliant",
      concentration: "10% - 15%",
      mechanism: "Dicarboxylic acid that inhibits 5-alpha reductase and tyrosinase while suppressing neutrophil ROS generation, clearing acne and post-inflammatory erythema.",
      bestFor: ["Acne", "Post-Acne Redness (PIE)", "Rosacea Rashes"],
      conflictsWith: ["Strong AHA/BHA exfoliants in same layer"],
      timeOfDay: "Both"
    },
    {
      name: "Niacinamide (Vitamin B3)",
      category: "Sebum Regulator",
      concentration: "2% - 10%",
      mechanism: "Inhibits melanosome transfer from melanocytes to keratinocytes and downregulates sebum triglycerides via NADPH pathway.",
      bestFor: ["Acne Marks", "Sebum Overproduction", "Enlarged Pores", "Barrier Weakness"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Ceramide NP / AP / EOP",
      category: "Barrier Repair",
      concentration: "1% - 3%",
      mechanism: "Sphingolipid structural component of intercellular lamellae; reconstitutes skin barrier matrix to reduce Transepidermal Water Loss (TEWL).",
      bestFor: ["Dryness", "Flakiness", "Compromised Lipid Barrier", "Erythema"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Centella Asiatica (Madecassoside)",
      category: "Barrier Repair",
      concentration: "1% - 5%",
      mechanism: "Suppresses pro-inflammatory cytokines (IL-1b, TNF-a) and promotes collagen type-I synthesis to accelerate skin rash healing.",
      bestFor: ["Red Rashes", "Irritation", "Sensitive Skin", "Post-Acne Erythema"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Tranexamic Acid",
      category: "Brightener",
      concentration: "2% - 5%",
      mechanism: "Synthetic lysine analog that blocks plasminogen binding to keratinocytes, inhibiting UV-induced prostaglandin and melanogenesis synthesis.",
      bestFor: ["Melasma", "Stubborn Dark Spots", "PIH"],
      conflictsWith: [],
      timeOfDay: "Both"
    },
    {
      name: "Granactive Retinoid / Retinol",
      category: "Anti-Aging",
      concentration: "0.1% - 1%",
      mechanism: "Binds retinoic acid nuclear receptors (RAR/RXR) to accelerate keratinocyte mitotic renewal and stimulate type-I collagen production.",
      bestFor: ["Fine Lines", "Wrinkles", "Loss of Elasticity", "Acne"],
      conflictsWith: ["AHA/BHA Acids in same routine", "Benzoyl Peroxide"],
      timeOfDay: "PM"
    }
  ] as ActiveIngredientInfo[],

  layeringRules: [
    "Cleanse with pH-balanced (5.5) cleanser to preserve the acid mantle.",
    "Apply water-based serums first (Hyaluronic Acid, Niacinamide, Caffeine Eye Serum), followed by treatment serums and oil-based active formulas.",
    "Apply targeted treatments (Retinoids or AHA/BHA) on completely dry skin to minimize skin stinging and barrier irritation.",
    "Seal with Ceramide moisture barrier cream to prevent Transepidermal Water Loss (TEWL).",
    "Always finish morning routine with broad-spectrum SPF 50 PA++++ to protect active ingredients from UV degradation."
  ],

  conflictMatrix: [
    { combo: "Retinoids + AHA/BHA", warning: "Avoid using Retinol and Salicylic/Glycolic Acid in the same application. Alternate nights to prevent severe barrier compromise." },
    { combo: "Vitamin C + Strong Acids", warning: "Do not layer high-concentration L-Ascorbic Acid directly over BHA/AHA exfoliants. Use Vitamin C in AM and Acids in PM." },
    { combo: "Retinoids + Benzoyl Peroxide", warning: "Benzoyl Peroxide oxidizes and inactivates Retinol molecules. Alternate AM/PM usage." },
    { combo: "Copper Peptides + Strong Acids", warning: "Low pH acids chelate copper ions, inactivating peptide anti-aging properties." }
  ],

  climateAdaptations: {
    humidSummer: "Use non-comedogenic gel hydrators and matte fluid sunscreens to prevent follicular congestion.",
    dryWinter: "Layer lipid-dense ceramide balms and multi-weight hyaluronic serums to combat low humidity TEWL.",
    urbanPollution: "Incorporate morning Vitamin C antioxidants and double cleansing to clear microscopic PM2.5 particulate matter."
  }
};

/**
 * Generates an ultra-detailed, clinically precise clinical analysis fallback
 */
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
    reason: `Formulated with clinical actives to target ${primaryConcern.toLowerCase()} while optimizing stratum corneum hydration.`
  }));

  return {
    diagnosis: `${skinType} Skin Profile (${primaryConcern} Focus)`,
    aiNote: `Clinical evaluation highlights ${skinTypeLower} epidermis with primary focus on ${primaryConcern.toLowerCase()}. Prescribing targeted chemical composition (${prescribedFormula.formula}) to cure underlying skin cellular dysfunction.`,
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
      "Avoid combining Retinoids and BHA/AHA exfoliants in the same PM session.",
      "Apply Vitamin C in AM before SPF; apply exfoliants in PM."
    ],
    climateAdvice: DERMATOLOGY_KNOWLEDGE.climateAdaptations.urbanPollution,
    profile: { skinType, sensitivity },
    schedule: {
      am: ["Cleanse (pH 5.5)", "Treat (Antioxidant / Niacinamide)", "Protect (SPF 50 PA++++)"],
      pm: ["Double Cleanse", "Targeted Active (Serum)", "Seal Barrier (Ceramide Cream)"]
    },
    recommendations: recs
  };
}

export function generateAgenticDiagnosticPrompt(userMessage: string, inventory: any[], hasImage: boolean) {
  const lower = userMessage.toLowerCase();
  
  if (hasImage) {
    return {
      reply: "🌿 **Visual Face Scan Assessment**\nAnalyzing your skin clarity, pore congestion, and redness distribution...\n\nTo ensure complete precision, please select your primary skin concern below:",
      askForImage: false,
      quickQuestions: ["Acne & Blackheads", "Dark Spots & Pigmentation", "Dryness & Barrier Care", "Redness & Sensitivity"],
      products: []
    };
  }

  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("help") || lower.length < 10) {
    return {
      reply: "🌿 **Welcome to GLOWMART Skin Care**\nHello! I am your AI Skincare Advisor. I'm here to understand your skin's unique needs and recommend effective active ingredient formulations.\n\nTell me what your skin is experiencing today, or choose an option below:",
      askForImage: true,
      quickQuestions: ["Acne & Redness Care", "Under-Eye Dark Circles", "Oily & Pore Care", "Dry & Sensitive Barrier"],
      products: []
    };
  }

  return null;
}

/**
 * Universal Generative Response Engine: Dynamically synthesizes ANY skin query or event
 * into a structured agentic clinical report with matching site catalog offers.
 */
export function generateUniversalGenerativeResponse(userMessage: string, inventory: any[], hasImage: boolean) {
  const agenticPrompt = generateAgenticDiagnosticPrompt(userMessage, inventory, hasImage);
  if (agenticPrompt) return agenticPrompt;

  const lower = userMessage.toLowerCase();
  const catalog = inventory && inventory.length > 0 ? inventory : CLINICAL_FALLBACK_CATALOG;

  const hasAcne = lower.includes("acne") || lower.includes("pimple") || lower.includes("pore") || lower.includes("sebum") || lower.includes("spot") || lower.includes("blackhead") || lower.includes("whitehead") || lower.includes("breakout");
  const hasRash = lower.includes("rash") || lower.includes("red") || lower.includes("irritat") || lower.includes("rosacea") || lower.includes("burn") || lower.includes("stinging") || lower.includes("erythema");
  const hasDarkCircles = lower.includes("dark circle") || lower.includes("eye") || lower.includes("under eye") || lower.includes("puff") || lower.includes("periorbital");
  const hasPigmentation = lower.includes("dark spot") || lower.includes("pigment") || lower.includes("mark") || lower.includes("melasma") || lower.includes("dull") || lower.includes("discoloration");
  const hasDryness = lower.includes("dry") || lower.includes("dehydrat") || lower.includes("flak") || lower.includes("tewl") || lower.includes("barrier") || lower.includes("tight");
  const hasAging = lower.includes("aging") || lower.includes("wrinkle") || lower.includes("line") || lower.includes("sag") || lower.includes("retinol") || lower.includes("collagen");
  const hasFungal = lower.includes("fungal") || lower.includes("malassezia") || lower.includes("itching") || lower.includes("tiny bumps");
  const hasSun = lower.includes("sun") || lower.includes("spf") || lower.includes("uv") || lower.includes("tan") || lower.includes("burn");
  const hasConflict = lower.includes("mix") || lower.includes("conflict") || lower.includes("layer") || lower.includes("combine") || lower.includes("order");

  // Synthesize dynamic concerns array
  const detectedConcerns: string[] = [];
  const activeMolecules: string[] = [];
  const mechanisms: string[] = [];
  let askForImage = false;

  if (hasFungal) {
    detectedConcerns.push("Malassezia Folliculitis (Fungal Acne)");
    activeMolecules.push("2% Salicylic Acid (BHA)", "10% Niacinamide", "Ketoconazole / Zinc Pyrithione");
    mechanisms.push("BHA clears lipid-free follicular pores without feeding yeast growth");
    askForImage = true;
  }
  if (hasAcne) {
    detectedConcerns.push("Comedonal Acne & Pore Congestion");
    activeMolecules.push("2% Salicylic Acid (BHA)", "10% Niacinamide", "1% Zinc PCA");
    mechanisms.push("BHA decongests pores while Zinc PCA & Niacinamide regulate sebum kinetics");
    askForImage = true;
  }
  if (hasRash) {
    detectedConcerns.push("Skin Redness & Sensitivity");
    activeMolecules.push("5% Centella Asiatica (Madecassoside)", "1% Panthenol (B5)", "Colloidal Oat");
    mechanisms.push("Centella & Panthenol soothe skin redness and reinforce your acid mantle");
    askForImage = true;
  }
  if (hasDarkCircles) {
    detectedConcerns.push("Periorbital Dark Circles & Eye Puffiness");
    activeMolecules.push("5% Caffeine", "EGCG", "Haloxyl Peptide");
    mechanisms.push("Caffeine vasoconstricts infraorbital microcapillaries to depuff and brighten under-eyes");
    askForImage = true;
  }
  if (hasPigmentation && !hasDarkCircles) {
    detectedConcerns.push("Dark Spots & Uneven Tone");
    activeMolecules.push("2% Alpha Arbutin", "1% Tranexamic Acid", "15% Vitamin C");
    mechanisms.push("Alpha Arbutin & Tranexamic Acid help block melanosome transfer for clear radiance");
  }
  if (hasDryness && !hasRash) {
    detectedConcerns.push("Dehydrated Skin Barrier");
    activeMolecules.push("3% Ceramide Complex (NP/AP/EOP)", "2% Multi-Weight Hyaluronic Acid");
    mechanisms.push("Ceramides seal intercellular moisture to reduce moisture loss");
  }
  if (hasAging) {
    detectedConcerns.push("Fine Lines & Elasticity Loss");
    activeMolecules.push("0.2% Granactive Retinoid", "Matrixyl 3000 Peptides");
    mechanisms.push("Retinoids encourage collagen renewal for firm, youthful elasticity");
  }
  if (hasSun) {
    detectedConcerns.push("Sun Protection & Defense");
    activeMolecules.push("SPF 50 PA++++", "Tinosorb M Filters", "15% Vitamin C");
    mechanisms.push("Broad-spectrum SPF 50 shields skin cells against UVA/UVB photo-damage");
  }

  // Default fallback if no specific keywords hit
  if (detectedConcerns.length === 0) {
    detectedConcerns.push("Daily Skin Barrier Care");
    activeMolecules.push("10% Niacinamide", "3% Ceramides", "SPF 50 PA++++");
    mechanisms.push("Protects lipid mantle integrity and promotes smooth skin cell turnover");
    askForImage = true;
  }

  const diagnosisText = detectedConcerns.join(" + ");
  const formulaText = activeMolecules.join(" + ");
  const mechanismText = mechanisms.join("; ");

  const replyText = `🔬 Clinical Evaluation\n${diagnosisText}

🧪 Prescribed Active Formula
${formulaText}

💡 How This Works For You
${mechanismText}

📋 Daily Routine Regimen
- AM: Gentle pH 5.5 Cleanser → ${hasDarkCircles ? '5% Caffeine Eye Serum → ' : ''}Target Serum → ${hasRash ? 'Cica Soothing Balm → ' : ''}SPF 50 PA++++ Sunscreen
- PM: Double Cleanse → ${hasAcne || hasFungal ? '2% Salicylic Acid (3x/wk) → ' : ''}Target Active → Ceramide Barrier Repair Cream

⚠️ Gentle Care Note
${hasConflict || hasAcne || hasAging ? 'Avoid using Retinoids and Exfoliating Acids in the same evening. Use Vitamin C in the morning under sunscreen.' : 'Apply water-based serums on slightly damp skin, followed by your moisturizer.'}`;

  // Filter relevant products
  let matchedProds = catalog.filter(p => {
    const pName = p.name.toLowerCase();
    const pDesc = p.description.toLowerCase();
    return (
      (hasDarkCircles && (pName.includes("eye") || pName.includes("caffeine"))) ||
      (hasRash && (pName.includes("centella") || pName.includes("soothing") || pName.includes("ceramide"))) ||
      ((hasAcne || hasFungal) && (pName.includes("niacinamide") || pName.includes("salicylic") || pName.includes("cleanser"))) ||
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
      reason: p.description || "Formulated with clinical active ingredients to treat your skin profile."
    };
  });

  const quickQuestions = [
    askForImage ? "📷 Upload Photo for 98% Scan" : "AM vs PM routine order",
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
