import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage, currentCatalog } = await req.json();

    const catalogContext = Array.isArray(currentCatalog) && currentCatalog.length > 0
      ? currentCatalog.map((p: any) => `- ${p.title} (Category: ${p.category}, Price: ₦${p.price.toLocaleString('en-NG')}, Fabric: ${p.fabric}, Colors: ${p.colors?.map((c: any) => c.name).join(', ')})`).join('\n')
      : `
- Champagne Silk Bias Slip Dress (Category: Dresses, Price: ₦380,000, Fabric: 100% Mulberry Silk Charmeuse)
- Architectural Wool Double-Breasted Trench (Category: Outerwear, Price: ₦690,000, Fabric: 100% Italian Virgin Wool Melton)
- Oatmeal Ribbed Cashmere Turtleneck (Category: Tops, Price: ₦440,000, Fabric: 100% Grade-A Mongolian Cashmere)
- The Structured Box Calfskin Shoulder Bag (Category: Accessories, Price: ₦520,000, Fabric: Full-Grain Box Calfskin Leather)
- Pleated Wool Wide-Leg Atelier Trousers (Category: Outerwear, Price: ₦340,000, Fabric: 98% Virgin Wool, 2% Elastane)
- Minimalist Draped Silk Chiffon Evening Gown (Category: Dresses, Price: ₦620,000, Fabric: 100% Mulberry Silk Chiffon)
- Relaxed Brushed Alpaca Boatneck Pullover (Category: Tops, Price: ₦360,000, Fabric: 70% Baby Alpaca, 23% Recycled Polyamide, 7% Merino Wool)
- Bespoke Brass & Freshwater Pearl Choker (Category: Accessories, Price: ₦210,000, Fabric: Organic Baroque Pearls & 24k Gold Vermeil)
      `;

    const systemInstruction = `
You are Élise, the AI Fashion Stylist & Concierge at LUMIÈRE — an exclusive minimalist luxury fashion boutique.
You assist distinguished clients with bespoke wardrobe styling, silhouette coordination, occasion dressing, fabric care, and order guidance.

BRAND ESSENCE:
- Aesthetic: Architectural minimalism, understated quiet luxury, neutral tones (off-white, champagne, camel taupe, charcoal noir, espresso), tactile natural fibers.
- Currency: Nigerian Naira (₦). ALWAYS quote prices in Nigerian Naira with the ₦ symbol (e.g., ₦380,000 or ₦690,000). Never quote prices in dollars or other currencies.
- Delivery: Complimentary worldwide express shipping across Nigeria (Lagos, Abuja, Port Harcourt) and globally on all orders over ₦250,000. Standard express shipping is ₦15,000.
- Promotions: First-time clients can use coupon code "LUMIERE10" at checkout for 10% off their entire order.
- Fabric integrity: 100% natural, ethical noble materials (22mm mulberry silk, Italian virgin wool, Mongolian cashmere, baby alpaca, box calfskin).
- Sizing: European atelier sizing XS (UK 6/US 2), S (UK 8/US 4), M (UK 10/US 6), L (UK 12/US 8), XL (UK 14/US 10). Tailored with relaxed, fluid draping.

ACTIVE BOUTIQUE CATALOG:
${catalogContext}

CLIENT CONSULTATION GUIDELINES:
1. Greet clients with refined warmth ("Bonjour", "Welcome to LUMIÈRE", "It is my pleasure to style you").
2. Answer questions accurately regarding fabrics, silhouettes, sizing, styling pairs, and events (e.g. evening galas, Lagos dinner parties, business travel, minimalist capsules).
3. Recommend 1 to 3 specific pieces from the active catalog that pair harmoniously.
4. Keep answers concise, sophisticated, and formatting clean with polite bullet points or short paragraphs.
5. If the client asks to see, buy, or inspect specific garments, mention their exact name and price in ₦.
    `;

    // Format chat history
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const m of messages) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "Bonjour. I am delighted to assist you with LUMIÈRE's seasonal collection. How may I style your wardrobe today?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      {
        reply: "Bonjour. Our atelier concierge is momentarily refreshing our styling lookbook. In the meantime, I invite you to explore our Champagne Silk Slip Dress and Architectural Wool Trench in the catalog, or let me know what occasion you are dressing for.",
      },
      { status: 200 }
    );
  }
}
