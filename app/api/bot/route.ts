import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../lib/models/Product';
import { DERMATOLOGY_KNOWLEDGE, CLINICAL_FALLBACK_CATALOG, generateAgenticDiagnosticPrompt, generateUniversalGenerativeResponse } from '../../../lib/ai/dermatologyKnowledge';

function generateFallbackBotReply(userMessage: string, inventory: any[], hasImage: boolean) {
  return generateUniversalGenerativeResponse(userMessage, inventory, hasImage);
}

export async function POST(request: Request) {
  try {
    const { history } = await request.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: 'Conversation history is required' }, { status: 400 });
    }

    let products: any[] = [];
    try {
      const conn = await connectToDatabase();
      if (conn) {
        products = await Product.find({}).limit(50);
      }
    } catch (e) {
      console.warn("DB offline during bot query, using fallback inventory", e);
    }

    if (!products || products.length === 0) {
      products = CLINICAL_FALLBACK_CATALOG;
    }

    const lastUserMsgObj = history[history.length - 1] || {};
    const lastUserText = lastUserMsgObj.text || "";
    const hasImage = !!lastUserMsgObj.image;

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || !apiKey.startsWith("AIzaSy")) {
      console.warn("⚠️ GEMINI_API_KEY is missing or invalid. Using agentic clinical fallback engine.");
      const fallbackResponse = generateFallbackBotReply(lastUserText, products, hasImage);
      return NextResponse.json(fallbackResponse, { status: 200 });
    }

    const productContext = products.map((p: any) => {
      const orig = p.originalPrice || Math.round(p.price * 1.35);
      const discount = Math.round((1 - p.price / orig) * 100);
      return `- ID: ${p._id} | ${p.name} (${p.brand}) | Offer Price: ₹${p.price} (MSRP ₹${orig} - ${discount}% OFF) | Formula: ${p.chemicalComposition || 'Clinical Active Formula'} | Description: ${p.description}`;
    }).join("\n");

    const activesInfo = DERMATOLOGY_KNOWLEDGE.actives.map(a => `- ${a.name} (${a.category}, ${a.concentration}): ${a.mechanism}`).join('\n');

    const systemPrompt = `You are a Universal Autonomous AI Dermatology Advisor for 'GLOWMART INDIA'.
You possess universal diagnostic and pharmacological capabilities to analyze, evaluate, and prescribe active skincare formulations for ANY skin disease, condition, or symptom combination presented by the user (including Acne Vulgaris, Rosacea, Psoriasis, Eczema/Atopic Dermatitis, Seborrheic Dermatitis, Melasma/PIH, Keratosis Pilaris, Folliculitis, Contact Dermatitis, Urticaria, Vitiligo, Tinea, Sun Damage, TEWL Barrier Disruption, Chronological Aging).

Your clinical intelligence is grounded in premier medical dermatology knowledge sources:
- DermNet NZ (dermnetnz.org - Visual Dermatology & Condition Dictionary)
- American Academy of Dermatology (aad.org - AAD Clinical Care Guidelines & Patient Safety)
- Cleveland Clinic Dermatology (my.clevelandclinic.org - Etiology, Symptom Pathology & Active Cell Therapy)
- Indian Journal of Dermatology, Venereology & Leprology (ijdvl.com - Fitzpatrick IV-VI Asian Skin Guidelines)
- Journal of Cosmetic Dermatology (wiley.com - Active Ingredient Kinetics & Barrier Lipidomics)

CLINICAL ACTIVE DICTIONARY:
${activesInfo}

RESPONSE FORMATTING GUIDELINES:
1. Be fully generative and agentic: Address ANY skin disease or condition asked by the user with complete clinical accuracy and empathy.
2. Speak in a warm, caring, encouraging human tone that makes complex dermatological science simple and accessible.
3. Structure your response into these clean sections:
   🔬 Clinical Evaluation: 1-sentence diagnostic evaluation covering all user symptoms or condition.
   🧪 Prescribed Active Formula: Write ONLY the exact active ingredient formula on the line below it (e.g. "2% Salicylic Acid + 10% Niacinamide + 5% Centella + 5% Caffeine").
   💡 How This Works For You: 1-2 friendly sentences explaining how these active molecules treat their skin cells.
   📋 Daily Routine Regimen: Clear, concise AM and PM steps. Use '→' arrow notation cleanly.
   ⚠️ Gentle Care Note: Helpful advice on layering, patch testing, or sun protection.
4. Append structured JSON blocks at the very end inside [RECOMMENDED_PRODUCTS_JSON] and [/RECOMMENDED_PRODUCTS_JSON], and [DIAGNOSTIC_QUESTIONS_JSON]:

[DIAGNOSTIC_QUESTIONS_JSON]
{
  "askForImage": true,
  "quickQuestions": ["Acne & Redness Care", "Under-Eye Dark Circles", "Oily & Pore Care", "Dry & Sensitive Barrier"]
}
[/DIAGNOSTIC_QUESTIONS_JSON]

[RECOMMENDED_PRODUCTS_JSON]
[
  {
    "id": "exact_id_from_inventory",
    "name": "Product Name",
    "brand": "Brand",
    "price": 499,
    "originalPrice": 699,
    "offerBadge": "SAVE 28%",
    "chemicalComposition": "2% Salicylic Acid + 10% Niacinamide",
    "reason": "1-sentence friendly reason why this matches their skin needs"
  }
]
[/RECOMMENDED_PRODUCTS_JSON]

INVENTORY CONTEXT:
${productContext}`;

    const contents = history.map((msg: any) => {
      const parts: any[] = [];
      if (msg.text) parts.push({ text: msg.text });
      if (msg.image) {
        const match = msg.image.match(/^data:(image\/[a-zA-Z]*);base64,([^\"]*)$/);
        if (match) {
          parts.push({
            inline_data: { mime_type: match[1], data: match[2] }
          });
        }
      }
      if (parts.length === 0) parts.push({ text: " " });
      return {
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: parts
      };
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: contents
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API HTTP Error:", data);
      const fallbackResponse = generateFallbackBotReply(lastUserText, products, hasImage);
      return NextResponse.json(fallbackResponse, { status: 200 });
    }

    let aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiReply) {
      const fallbackResponse = generateFallbackBotReply(lastUserText, products, hasImage);
      return NextResponse.json(fallbackResponse, { status: 200 });
    }

    let quickQuestions: string[] = [];
    let askForImage = false;
    const diagMatch = aiReply.match(/\[DIAGNOSTIC_QUESTIONS_JSON\]([\s\S]*?)\[\/DIAGNOSTIC_QUESTIONS_JSON\]/);
    if (diagMatch) {
      try {
        const parsedDiag = JSON.parse(diagMatch[1].trim());
        quickQuestions = parsedDiag.quickQuestions || [];
        askForImage = !!parsedDiag.askForImage;
      } catch (err) {
        console.error("Failed to parse diagnostic questions JSON", err);
      }
      aiReply = aiReply.replace(/\[DIAGNOSTIC_QUESTIONS_JSON\][\s\S]*?\[\/DIAGNOSTIC_QUESTIONS_JSON\]/, '').trim();
    }

    let recommendedProducts: any[] = [];
    const jsonMatch = aiReply.match(/\[RECOMMENDED_PRODUCTS_JSON\]([\s\S]*?)\[\/RECOMMENDED_PRODUCTS_JSON\]/);
    
    if (jsonMatch) {
      try {
        const parsedProducts = JSON.parse(jsonMatch[1].trim());
        recommendedProducts = parsedProducts.map((p: any) => {
          const matchProd = products.find((item: any) => item._id?.toString() === p.id?.toString());
          const orig = matchProd?.originalPrice || p.originalPrice || Math.round((matchProd?.price || p.price || 500) * 1.35);
          const discount = Math.round((1 - (matchProd?.price || p.price) / orig) * 100);

          return {
            id: matchProd?._id || p.id,
            name: matchProd?.name || p.name,
            brand: matchProd?.brand || p.brand,
            price: matchProd?.price || p.price,
            originalPrice: orig,
            offerBadge: p.offerBadge || (discount > 0 ? `SAVE ${discount}%` : "OFFER"),
            chemicalComposition: matchProd?.chemicalComposition || p.chemicalComposition || "Clinical Formula",
            image: matchProd?.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
            reason: p.reason || ""
          };
        });
      } catch (err) {
        console.error("Failed to parse recommended products JSON from bot output", err);
      }
      aiReply = aiReply.replace(/\[RECOMMENDED_PRODUCTS_JSON\][\s\S]*?\[\/RECOMMENDED_PRODUCTS_JSON\]/, '').trim();
    }

    return NextResponse.json({ 
      reply: aiReply,
      products: recommendedProducts,
      quickQuestions,
      askForImage
    }, { status: 200 });

  } catch (error) {
    console.error("Bot API Error:", error);
    return NextResponse.json(generateFallbackBotReply("help", CLINICAL_FALLBACK_CATALOG, false), { status: 200 });
  }
}
