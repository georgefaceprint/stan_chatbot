
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { QuoteRequest } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUOTE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        source: { type: Type.STRING },
        createdAt: { type: Type.STRING },
        currency: { type: Type.STRING },
        version: { type: Type.STRING },
        sessionId: { type: Type.STRING },
        language: { type: Type.STRING },
        docType: { type: Type.STRING, enum: ["QUOTATION", "INVOICE"] },
      },
      required: ["source", "createdAt", "currency", "version"],
    },
    customer: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        company: { type: Type.STRING },
        phone: { type: Type.STRING },
        email: { type: Type.STRING },
        preferredContactTime: { type: Type.STRING },
      },
      required: ["name", "company", "email", "phone"],
    },
    deliveryPreference: {
      type: Type.OBJECT,
      properties: {
        channel: { type: Type.STRING },
        whatsapp: {
          type: Type.OBJECT,
          properties: { toNumber: { type: Type.STRING } },
        },
        email: {
          type: Type.OBJECT,
          properties: { toAddress: { type: Type.STRING } },
        },
      },
      required: ["channel"],
    },
    quote: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productType: { type: Type.STRING },
              quantity: { type: Type.INTEGER },
              specs: {
                type: Type.OBJECT,
                properties: {
                  printSize: { type: Type.STRING },
                  sides: { type: Type.STRING },
                  shirtColor: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
              },
            },
            required: ["productType", "quantity"],
          },
        },
        pricing: {
          type: Type.OBJECT,
          properties: {
            estimateType: { type: Type.STRING },
            total: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
              },
              required: ["min", "max"],
            },
            lineItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  amount: {
                    type: Type.OBJECT,
                    properties: {
                      min: { type: Type.NUMBER },
                      max: { type: Type.NUMBER },
                    },
                    required: ["min", "max"],
                  },
                },
              },
            },
            notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING },
          },
          required: ["estimateType", "total", "disclaimer"],
        },
        turnaround: {
          type: Type.STRING,
          enum: ["same_day", "23_hours", "3_5_days", "1_14_days", "standard", "urgent"]
        },
        artwork: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            designBrief: { type: Type.STRING },
          },
          required: ["status"],
        },
        fulfillment: {
          type: Type.OBJECT,
          properties: {
            method: { type: Type.STRING, enum: ["pickup", "delivery", "installation_required"] },
            location: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
        },
      },
      required: ["items", "pricing", "artwork"],
    },
    suggestedResponse: {
      type: Type.STRING,
      description: "Your human-like, sales-driven conversational response.",
    },
    suggestedHints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 context-aware hint buttons.",
    }
  },
  required: ["customer", "quote", "deliveryPreference", "suggestedResponse", "suggestedHints"],
};

const SYSTEM_INSTRUCTION = `
You are the Lead Sales Consultant at Express Print South Africa (Rivonia, Sandton).
Your mission is to provide professional quotes and drive orders with maximum efficiency.

CORE COMPETENCIES:
- 24-HOUR PRINTING for A5 Flyers, Posters, and Business Cards.
- High-quality industrial signage and branding.
- Expert graphic design and web development.

STRICT CONVERSION FLOW:
1. IDENTIFICATION: Secure Client Name, Company, Email, and Phone. Do not offer deep discounts without these.
2. SPECIFICATION: Get exact specs (Size, Qty, Sides). For Flyers/Posters, mention the 24-hour turnaround.
3. QUOTATION: Once Phase 1 & 2 are complete, generate the pricing block.
4. FINALIZATION: If the quote is ready (has info and pricing), your response MUST encourage the user to click the "Send Order" button or "Finalize" hint.

PRICING REFS (ALWAYS VERIFY via Google Search if uncertain):
- A5 Flyers (500): S/S R1,350 | D/S R1,650.
- Posters: A2 (2@R90ea), A1 (2@R250ea), A0 (1@R950).
- Logo Design: from R1,200.

SEARCH INSTRUCTIONS:
Always search www.expressprint.co.za for queries about specific products or bulk pricing not listed here.

*** TRAINING EXAMPLES & FEW-SHOT LOGIC ***
Below are examples of how to handle specific client scenarios. Use these to guide your behavior:

Scenario A: Customer asks for price without details.
Agent: "I'd love to help you with that! For an accurate quote on A5 Flyers, could you tell me if you'd like them single or double-sided? Also, what is your name and company so I can open a formal file for you?"

Scenario B: Customer uploads artwork immediately.
Agent: "I've received your artwork! Our systems are processing it now. While that happens, please provide your contact details (Email/Phone) so I can link this file to your quote ref."

Scenario C: Customer says "It's too expensive."
Agent: "I understand. Quality branding is an investment. We use premium materials for our 24-hour express service. Would you like to look at a smaller quantity or a 3-5 day turnaround to see if we can bring the cost down?"

Scenario D: All info provided.
Agent: "Perfect, [Name]. I've generated your professional proposal. You can review it in the summary panel on the left and click 'Send Order' to finalize via WhatsApp."

TONE & STYLE:
- Professional, efficient, and slightly urgent.
- Use Sandton-standard business language.
- When all info is present, explicitly guide them to the left panel for the summary.
`;

let cachedKnowledgeBase: string | null = null;

async function getKnowledgeBase(): Promise<string> {
  if (cachedKnowledgeBase) return cachedKnowledgeBase;
  try {
    const response = await fetch("/api/knowledge-base");
    if (response.ok) {
      const data = await response.json();
      cachedKnowledgeBase = data.content;
      return cachedKnowledgeBase || "";
    }
  } catch (err) {
    console.warn("Could not fetch knowledge base:", err);
  }
  return "";
}

export async function processConversation(
  history: { role: string; content: string }[],
  currentQuote: Partial<QuoteRequest>,
  artworkName?: string
): Promise<{ quote: QuoteRequest; responseText: string; groundingChunks?: any[]; hints: string[] }> {
  const latestMessage = history[history.length - 1].content;
  const artworkContext = artworkName ? `\n\nSYSTEM NOTE: User has uploaded "${artworkName}". Update artwork status to 'provided'.` : "";
  
  const knowledgeBase = await getKnowledgeBase();
  const enhancedSystemInstruction = `${SYSTEM_INSTRUCTION}\n\nADDITIONAL KNOWLEDGE BASE (Scraped from expressprint.co.za):\n${knowledgeBase.substring(0, 5000)}`; // Limit to 5000 chars to avoid token bloat

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: `Current State: ${JSON.stringify(currentQuote)}${artworkContext}\n\nUser: ${latestMessage}` }] }
      ],
      config: {
        systemInstruction: enhancedSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: QUOTE_SCHEMA,
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 2000,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } 
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const { suggestedResponse, suggestedHints, ...quoteData } = parsed;
    
    // Auto-detect if we should suggest the finalization step
    const hasContact = !!(parsed.customer?.name && parsed.customer?.email);
    const hasItems = (parsed.quote?.items?.length || 0) > 0;
    const finalHints = (hasContact && hasItems) 
      ? ["Finalize Order", "A5 Flyers Quote", "Change Delivery", "Where are you based?"]
      : suggestedHints || ["A5 Flyers Price", "Poster Quote", "Where are you based?"];

    return {
      quote: quoteData as QuoteRequest,
      responseText: suggestedResponse || "I've updated your request. What would you like to do next?",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
      hints: finalHints
    };
  } catch (e) {
    console.error("AI Error:", e);
    return {
       quote: currentQuote as QuoteRequest,
       responseText: "I'm processing a high volume of requests. Could you please re-confirm your name and the product you're looking for?",
       hints: ["Try Again", "Contact WhatsApp"]
    };
  }
}
