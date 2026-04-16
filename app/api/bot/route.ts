import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../lib/models/Product';

export async function POST(request: Request) {
  try {
    const { message, image } = await request.json();

    if (!message && !image) {
      return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "Hello! I am your AI assistant. Currently, my AI brain is sleeping because the GEMINI_API_KEY is not set in the environment variables. Please restart your Next.js server if you just added it, or ask the developer to add it to Vercel!" 
      }, { status: 200 });
    }

    // Connect DB and fetch some context products
    await connectToDatabase();
    
    let productContext = "No products found in the database at the moment.";
    try {
      const products = await Product.find({}).limit(50);
      if (products && products.length > 0) {
        productContext = products.map((p: any) => `- ${p.name} (${p.brand}) | Price: RS. ${p.price} | Category: ${p.category} | Description: ${p.description}`).join("\n");
      }
    } catch (e) {
      console.error("DB Error fetching products:", e);
    }

    // Call Gemini API
    const prompt = `You are an expert AI Dermatologist and Skincare Assistant for an Indian beauty, cosmetics, and skincare online store called 'GLOWMART INDIA'.
CRITICAL RULE: Auto-detect the language of the user's message (Hindi or English). If the user speaks in Hindi (or Hinglish), YOU MUST reply in Hindi (or friendly Hinglish). If English, reply in English.

USER REQUEST INSTRUCTION:
If they upload a photo of their face/skin, analyze their skin type, tone, or concerns (like acne, dullness, or dark circles). Suggest a personalized skincare routine for them.
If they ask about products or if you are recommending a routine, EXCLUSIVELY use the INVENTORY CONTEXT provided below to recommend actual products from the Glowmart India store. Provide the price and a brief reason why they should buy it based on the description.
If a product they are looking for isn't listed in the context, politely mention that we might not have it in stock right now but encourage them to check our other categories like Skincare, Haircare, or Fragrances.

INVENTORY CONTEXT:
${productContext}

USER MESSAGE: ${message || "Please analyze the attached photo and suggest suitable skincare products."}
`;

    let parts: any[] = [{ text: prompt }];

    if (image) {
      // The image comes as a data URL: data:image/png;base64,iVBOR...
      const match = image.match(/^data:(image\/[a-zA-Z]*);base64,([^\"]*)$/);
      if (match) {
        parts.push({
          inline_data: {
            mime_type: match[1],
            data: match[2]
          }
        });
      }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API Error:", data);
        return NextResponse.json({ reply: "I'm having trouble thinking right now due to an AI server error. Please try again later." }, { status: 200 });
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      return NextResponse.json({ reply: "I'm sorry, I couldn't understand that. Could you rephrase your question?" }, { status: 200 });
    }

    return NextResponse.json({ reply: aiReply }, { status: 200 });

  } catch (error) {
    console.error("Bot API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
