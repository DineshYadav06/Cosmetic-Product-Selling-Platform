import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../lib/models/Product';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { skinType, concerns, sensitivity, ageRange } = data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI Brain missing' }, { status: 500 });
    }

    await connectToDatabase();
    
    // Fetch relevant products
    // We fetch a variety to give Gemini choices
    const allProducts = await Product.find({ inStock: true }).limit(100);

    const systemPrompt = `You are an expert AI Dermatologist for GLOWMART INDIA.
You will receive a user's skin profile (Type, Concerns, Sensitivity, Age).
Your task is to analyze this profile and select exactly 4 products from the provided inventory that would make a perfect 4-step routine (Cleanse, Treat, Moisturize, Protect).

OUTPUT FORMAT: Return EXCLUSIVELY a JSON object with this structure:
{
  "diagnosis": "A 2-3 word clinical summary of their skin state",
  "aiNote": "A personalized 2-sentence note from the AI expert",
  "profile": { "skinType": "...", "sensitivity": "..." },
  "recommendations": [
    {
      "id": "product_id",
      "step": "STEP NAME",
      "brand": "...",
      "name": "...",
      "price": number,
      "image": "...",
      "reason": "1-sentence specific reason why this matches their concerns"
    }
  ]
}

INVENTORY:
${allProducts.map(p => `- ID: ${p._id} | ${p.brand} ${p.name} | Cat: ${p.category} | Types: ${p.skinType?.join(',')} | Concerns: ${p.concerns?.join(',')} | Price: ${p.price}`).join('\n')}
`;

    const userPrompt = `USER PROFILE:
Skin Type: ${skinType}
Concerns: ${concerns.join(', ')}
Sensitivity: ${sensitivity}
Age: ${ageRange}

Analyze and select the best 4 products.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    const result = await response.json();
    const aiOutput = JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text || "{}");

    // Enhance AI output with real product data (images/etc) just in case
    const finalRecommendations = await Promise.all(
      aiOutput.recommendations.map(async (rec: any) => {
        const realProduct = allProducts.find(p => p._id.toString() === rec.id);
        return {
          ...rec,
          image: realProduct?.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
          price: realProduct?.price || rec.price
        };
      })
    );

    return NextResponse.json({
      ...aiOutput,
      recommendations: finalRecommendations
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
