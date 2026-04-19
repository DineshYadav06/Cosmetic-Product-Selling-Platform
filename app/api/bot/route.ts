import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../lib/models/Product';

export async function POST(request: Request) {
  try {
    const { history } = await request.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: 'Conversation history is required' }, { status: 400 });
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

    const systemPrompt = `You are an expert AI Dermatologist and Skincare Assistant for an Indian beauty, cosmetics, and skincare online store called 'GLOWMART INDIA'.
CRITICAL RULE: Auto-detect the language of the user's message (Hindi or English). If the user speaks in Hindi (or Hinglish), YOU MUST reply in Hindi (or friendly Hinglish). If English, reply in English.
CRITICAL RULE: You are participating in an ongoing conversation. Remember the user's previous messages and preferences.

USER REQUEST INSTRUCTION:
If they upload a photo of their face/skin, analyze their skin type, tone, or concerns (like acne, dullness, or dark circles). Suggest a personalized skincare routine for them.
If they ask about products or if you are recommending a routine, EXCLUSIVELY use the INVENTORY CONTEXT provided below to recommend actual products from the Glowmart India store. Provide the price and a brief reason why they should buy it based on the description.
If a product they are looking for isn't listed in the context, politely mention that we might not have it in stock right now but encourage them to check our other categories like Skincare, Haircare, or Fragrances.

INVENTORY CONTEXT:
${productContext}`;

    // Format conversation history for Gemini API
    const contents = history.map((msg: any) => {
      const parts: any[] = [];
      
      if (msg.text) {
        parts.push({ text: msg.text });
      }
      
      if (msg.image) {
        const match = msg.image.match(/^data:(image\/[a-zA-Z]*);base64,([^\"]*)$/);
        if (match) {
          parts.push({
            inline_data: {
              mime_type: match[1],
              data: match[2]
            }
          });
        }
      }

      if (parts.length === 0) {
         parts.push({ text: " " });
      }

      return {
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: parts
      };
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents
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

    // Attempt to log the chat to MongoDB for 1-week retention
    try {
      const BotChat = (await import('../../../lib/models/BotChat')).default;
      const lastUserMsg = history[history.length - 1];
      if (lastUserMsg && lastUserMsg.role === 'user') {
        let userMessageText = lastUserMsg.text;
        if (!userMessageText && lastUserMsg.image) userMessageText = "[Image Uploaded]";
        
        await BotChat.create({
          userMessage: userMessageText || "Unknown",
          botReply: aiReply
        });
      }
    } catch (dbErr) {
      console.error("Failed to save chat to DB:", dbErr);
    }

    return NextResponse.json({ reply: aiReply }, { status: 200 });

  } catch (error) {
    console.error("Bot API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
