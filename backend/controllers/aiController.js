import express from 'express';
import { GoogleGenAI } from '@google/genai';

const VALID_ACTIONS = ['NAVIGATE', 'SEARCH', 'ADD_TO_CART', 'GET_PRODUCT_DETAILS', 'GET_LATEST_ORDER', 'UNKNOWN'];
const VALID_ROUTES = ['/', '/collection', '/about', '/contact', '/login', '/cart', '/place-order', '/orders'];
const VALID_CATEGORIES = ['Men', 'Women', 'Kids'];
const VALID_SUBCATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];

export const handleIntent = async (req, res) => {
  try {
    const { text, alternatives } = req.body;

    // 1. Validation and Security
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Invalid or missing text input' });
    }
    if (text.length > 500) {
      return res.status(400).json({ success: false, message: 'Input too long' });
    }
    
    // Validate alternatives if supplied
    let contextAlternatives = '';
    if (alternatives && Array.isArray(alternatives)) {
      if (alternatives.length > 10) {
        return res.status(400).json({ success: false, message: 'Too many alternatives' });
      }
      contextAlternatives = alternatives.filter(a => typeof a === 'string').slice(0, 5).join(' | ');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // 2. Prompt construction
    const systemPrompt = `
You are an AI Voice Shopping Assistant for an e-commerce store.
Your ONLY job is to understand the user's intent and convert it into a structured JSON action.
DO NOT invent product prices, stock, product IDs, order status, or user info.
DO NOT return any markdown code fences (e.g. \`\`\`json). Return raw JSON only.

Supported Actions: ${VALID_ACTIONS.join(', ')}
Allowed Navigation Routes (only use these exact paths): ${VALID_ROUTES.join(', ')}

The user may speak in English, Hindi, or Hinglish (e.g. "Cart kholo" -> NAVIGATE to /cart).
Speech recognition may contain phonetic errors (e.g. "sits" instead of "shirts"). Use alternatives if provided.

Action Schemas:

1. NAVIGATE: { "action": "NAVIGATE", "target": "/cart", "reply": "Opening your cart." }
2. SEARCH: { "action": "SEARCH", "query": "shirts", "category": "Men", "subCategory": "Topwear", "priceMin": null, "priceMax": 3000, "sort": null, "reply": "Showing men's shirts under 3000 rupees." }
   (category must be one of: Men, Women, Kids. subCategory must be one of: Topwear, Bottomwear, Winterwear)
   (IMPORTANT: If the user uses generic words like 'clothes', 'clothing', 'items', 'products', 'show me', etc., do NOT put them in the 'query' field. Only put specific search terms like 'shirts', 'jeans', 'cotton', etc. If there is no specific keyword, leave 'query' as null.)
3. ADD_TO_CART: { "action": "ADD_TO_CART", "productId": null, "size": "M", "quantity": 1, "reply": "I'll add this product in size M to your cart." }
   (productId MUST be null since you don't know it)
4. GET_PRODUCT_DETAILS: { "action": "GET_PRODUCT_DETAILS", "productId": null, "reply": "Getting the product details." }
5. GET_LATEST_ORDER: { "action": "GET_LATEST_ORDER", "reply": "Checking your latest order." }
6. UNKNOWN: { "action": "UNKNOWN", "reply": "Sorry, I didn't understand that command." }

If the command doesn't match an action, or if it requests an unsupported route, return UNKNOWN.
`;

    const userPrompt = contextAlternatives 
      ? `User said: "${text}"\nSpeech alternatives: [${contextAlternatives}]`
      : `User said: "${text}"`;

    // 3. Call Gemini API using the official SDK
    const ai = new GoogleGenAI({ apiKey });
    
    let resultText = '';
    try {
      const apiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });
      resultText = apiResponse.text || '';
    } catch (apiError) {
      console.error("Gemini SDK error:", apiError);
      if (apiError.status === 429) {
        return res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
      }
      return res.status(502).json({ success: false, message: 'Failed to communicate with AI provider' });
    }
    
    // Remove markdown code fences if present (fallback)
    resultText = resultText.replace(/^\s*```json/mi, '').replace(/```\s*$/m, '').trim();

    let jsonResult;
    try {
      jsonResult = JSON.parse(resultText);
    } catch (e) {
      // Robust JSON extraction for models that output extra characters
      try {
        let start = resultText.indexOf('{');
        if (start === -1) throw new Error("No start brace found");
        let braces = 0;
        let end = -1;
        for (let i = start; i < resultText.length; i++) {
          if (resultText[i] === '{') braces++;
          else if (resultText[i] === '}') {
            braces--;
            if (braces === 0) { end = i; break; }
          }
        }
        if (end !== -1) {
          jsonResult = JSON.parse(resultText.substring(start, end + 1));
        } else {
          // If the JSON is missing the closing brace entirely, append it
          jsonResult = JSON.parse(resultText.substring(start) + "}");
        }
      } catch (innerE) {
        console.error("Failed to parse Gemini JSON:", resultText);
        return res.status(200).json({ success: true, intent: { action: 'UNKNOWN', reply: 'I encountered an error processing your request.' } });
      }
    }

    // 4. Validation of Gemini Output
    if (!VALID_ACTIONS.includes(jsonResult.action)) {
      jsonResult.action = 'UNKNOWN';
    }

    if (jsonResult.action === 'NAVIGATE' && !VALID_ROUTES.includes(jsonResult.target)) {
      jsonResult.action = 'UNKNOWN';
      jsonResult.reply = "I cannot navigate there.";
    }

    if (jsonResult.action === 'SEARCH') {
      if (jsonResult.category && !VALID_CATEGORIES.includes(jsonResult.category)) jsonResult.category = null;
      if (jsonResult.subCategory && !VALID_SUBCATEGORIES.includes(jsonResult.subCategory)) jsonResult.subCategory = null;
    }

    res.status(200).json({ success: true, intent: jsonResult });

  } catch (error) {
    console.error("Error in aiController:", error);
    res.status(500).json({ success: false, message: 'An unexpected server error occurred' });
  }
};
