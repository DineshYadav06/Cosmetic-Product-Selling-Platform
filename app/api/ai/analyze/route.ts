import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../lib/models/Product';
import { generateClinicalAnalysis, DERMATOLOGY_KNOWLEDGE, CLINICAL_FALLBACK_CATALOG, CONDITION_FORMULAS } from '../../../../lib/ai/dermatologyKnowledge';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { skinType = "Combination", concerns = [], sensitivity = "Normal", ageRange = "20-30", image } = data;

    let allProducts: any[] = [];
    try {
      const conn = await connectToDatabase();
      if (conn) {
        allProducts = await Product.find({ inStock: true }).limit(100);
      }
    } catch (dbErr) {
      console.warn("DB offline during AI analysis, using fallback inventory", dbErr);
    }

    if (!allProducts || allProducts.length === 0) {
      allProducts = CLINICAL_FALLBACK_CATALOG;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.startsWith("AIzaSy")) {
      console.warn("⚠️ GEMINI_API_KEY missing or invalid format. Using clinical dermatology fallback engine.");
      return NextResponse.json(generateClinicalAnalysis(skinType, concerns, sensitivity, allProducts));
    }

    const inventoryList = allProducts.map(p => {
      const orig = p.originalPrice || Math.round(p.price * 1.35);
      const discount = Math.round((1 - p.price / orig) * 100);
      return `- ID: ${p._id} | ${p.brand} ${p.name} | Cat: ${p.category} | Price: ₹${p.price} (MSRP ₹${orig} - ${discount}% OFF) | Formula: ${p.chemicalComposition || 'Clinical Actives'} | Description: ${p.description}`;
    }).join('\n');

    const activeList = DERMATOLOGY_KNOWLEDGE.actives.map(a => `${a.name}: ${a.mechanism}`).join('\n');

    const systemPrompt = `You are a Chief Clinical Dermatologist & Cosmetic Chemist for GLOWMART INDIA.
Analyze the user's skin profile (Skin Type, Concerns, Sensitivity, Age) and optional face image using advanced cosmetic science.

CLINICAL ACTIVE INGREDIENTS DICTIONARY:
${activeList}

Task:
1. Provide a precise clinical diagnostic summary, skin barrier integrity state (TEWL), and visual assessment breakdown.
2. Prescribe an exact chemical composition formula to cure their primary skin condition (e.g. "2% Salicylic Acid + 1% Zinc PCA + 5% Niacinamide").
3. Scan website inventory, comparing regular vs offer prices, and select 4 products building a 4-step regimen:
   - Step 1: Cleanse
   - Step 2: Treat (Active Serum)
   - Step 3: Moisturize
   - Step 4: Protect (Sunscreen/Shield)

OUTPUT FORMAT: Return EXCLUSIVELY a JSON object matching this exact structure:
{
  "diagnosis": "Clinical 2-4 word diagnosis",
  "aiNote": "2-sentence clinical dermatological analysis connecting user concerns to specific skin cell mechanisms.",
  "healthScore": 82,
  "visualAnalysis": {
    "hydrationLevel": "72%",
    "oilinessLevel": "Moderate T-Zone",
    "rednessScore": "Low",
    "primaryConcern": "Acne & Dullness"
  },
  "prescribedComposition": {
    "formula": "2% Salicylic Acid + 10% Niacinamide + 1% Zinc PCA",
    "mechanism": "Dissolves follicular desmosomes, halts 5-alpha reductase sebum kinetics, and calms inflammation.",
    "cureProtocol": "Apply 2% BHA 3x/week in PM. Follow with Niacinamide & Zinc PCA daily to prevent microcomedones."
  },
  "activeIngredientsNeeded": [
    "2% Salicylic Acid (Pore Decongestion)",
    "Ceramides NP/AP (Barrier Repair)",
    "10% Niacinamide (Sebum Control)"
  ],
  "barrierStatus": "Slightly Compromised Lipid Matrix (Moderate TEWL)",
  "routineLayeringTips": [
    "Apply water-based serums on damp skin.",
    "Wait 5 mins before applying ceramide cream.",
    "Apply broad-spectrum SPF 50 as final AM layer."
  ],
  "ingredientConflictsToAvoid": [
    "Do not layer Retinoids with AHA/BHA in the same PM session."
  ],
  "climateAdvice": "Use lightweight non-comedogenic formulas to prevent sweat-induced follicular congestion.",
  "profile": {
    "skinType": "${skinType}",
    "sensitivity": "${sensitivity}"
  },
  "schedule": {
    "am": ["Cleanse (pH 5.5)", "Treat (Niacinamide/C)", "Protect (SPF 50 PA++++)"],
    "pm": ["Double Cleanse", "Treat (Active Serum)", "Moisturize (Ceramide Cream)"]
  },
  "recommendations": [
    {
      "id": "exact_product_id_from_inventory",
      "step": "STEP 1: CLEANSE",
      "brand": "Brand Name",
      "name": "Product Name",
      "price": 499,
      "originalPrice": 699,
      "offerBadge": "SAVE 28%",
      "chemicalComposition": "pH 5.5 Hyaluronic Cleanser",
      "reason": "Specific 1-sentence dermatological reason why this product and its active ingredients match their skin profile."
    }
  ]
}

INVENTORY WITH OFFERS & FORMULAS:
${inventoryList}`;

    const userPrompt = `USER CLINICAL PROFILE:
- Skin Type: ${skinType}
- Main Concerns: ${Array.isArray(concerns) ? concerns.join(', ') : concerns || 'General Maintenance'}
- Sensitivity Level: ${sensitivity}
- Age Range: ${ageRange}
- Image Attached: ${image ? 'YES' : 'NO'}`;

    const userParts: any[] = [{ text: systemPrompt + "\n\n" + userPrompt }];

    if (image && typeof image === 'string') {
      const match = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        userParts.push({
          inline_data: { mime_type: match[1], data: match[2] }
        });
      }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: userParts }],
        generationConfig: { response_mime_type: "application/json", temperature: 0.2 }
      })
    });

    const result = await response.json();
    if (!response.ok) {
      console.warn("Gemini API response error in clinical analyze route, using clinical fallback", result);
      return NextResponse.json(generateClinicalAnalysis(skinType, concerns, sensitivity, allProducts));
    }

    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const aiOutput = JSON.parse(rawText);

    const finalRecommendations = (aiOutput.recommendations || []).map((rec: any) => {
      const realProduct = allProducts.find(p => p._id.toString() === rec.id?.toString());
      const orig = realProduct?.originalPrice || rec.originalPrice || Math.round((realProduct?.price || rec.price || 500) * 1.35);
      const discount = Math.round((1 - (realProduct?.price || rec.price) / orig) * 100);
      
      return {
        ...rec,
        id: realProduct?._id || rec.id,
        brand: realProduct?.brand || rec.brand,
        name: realProduct?.name || rec.name,
        price: realProduct?.price || rec.price,
        originalPrice: orig,
        offerBadge: rec.offerBadge || (discount > 0 ? `SAVE ${discount}%` : "OFFER"),
        chemicalComposition: realProduct?.chemicalComposition || rec.chemicalComposition || "Clinical Formula",
        image: realProduct?.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400"
      };
    });

    return NextResponse.json({
      diagnosis: aiOutput.diagnosis || `${skinType} Clinical Profile`,
      aiNote: aiOutput.aiNote || "Skin profile shows good overall balance. Maintain daily barrier hydration and SPF protection.",
      healthScore: aiOutput.healthScore || 85,
      visualAnalysis: aiOutput.visualAnalysis || {
        hydrationLevel: "78%",
        oilinessLevel: "Balanced",
        rednessScore: "Low",
        primaryConcern: concerns[0] || "Maintenance"
      },
      prescribedComposition: aiOutput.prescribedComposition || CONDITION_FORMULAS.barrierDamage,
      activeIngredientsNeeded: aiOutput.activeIngredientsNeeded || ["Niacinamide", "Ceramides", "Hyaluronic Acid"],
      barrierStatus: aiOutput.barrierStatus || "Intact Epidermal Barrier",
      routineLayeringTips: aiOutput.routineLayeringTips || DERMATOLOGY_KNOWLEDGE.layeringRules.slice(0, 3),
      ingredientConflictsToAvoid: aiOutput.ingredientConflictsToAvoid || ["Do not mix Retinoids with AHAs/BHAs in same layer."],
      climateAdvice: aiOutput.climateAdvice || DERMATOLOGY_KNOWLEDGE.climateAdaptations.urbanPollution,
      profile: aiOutput.profile || { skinType, sensitivity },
      schedule: aiOutput.schedule || {
        am: ["Cleanse (pH 5.5)", "Treat (Serum)", "Protect (SPF 50)"],
        pm: ["Double Cleanse", "Active Treatment", "Seal Barrier (Cream)"]
      },
      recommendations: finalRecommendations
    });

  } catch (error: any) {
    console.error("AI Clinical Analysis Error:", error);
    return NextResponse.json(generateClinicalAnalysis("Combination", ["Hydration"], "Normal", CLINICAL_FALLBACK_CATALOG));
  }
}
