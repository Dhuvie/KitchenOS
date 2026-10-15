const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

router.post('/stream', async (req, res) => {
  const { prompt, history = [], apiKey: clientApiKey } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Prompt is required' });
  }

  const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(401).json({ 
      code: 'NO_API_KEY', 
      message: 'GEMINI_API_KEY is not set in backend .env nor provided by client.' 
    });
  }

  // Set up SSE headers early
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const preferredModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash'
  ].filter(Boolean);

  let streamSucceeded = false;
  const genAI = new GoogleGenerativeAI(apiKey);

  const systemInstruction = `You are GRAVITAS, an elite Michelin-star executive culinary intelligence atelier.
Your role is to transform available ingredients into an extraordinary, technique-driven culinary masterpiece.
You MUST return your response as a stream of blocks in valid Newline-Delimited JSON (NDJSON).
Each line must be a single, complete JSON object.
Do NOT output any markdown code blocks, backticks, comments, or extraneous text. Just one valid JSON object per line.

Valid block types:
1. "card": {
     "type": "card",
     "content": {
       "title": "Poetic gourmet title (e.g. Pan-Seared Sea Bass with Saffron Emulsion)",
       "subtitle": "Artisanal tagline",
       "description": "Sensory tasting notes and description of the dish",
       "cuisine": "French / Modern American / Italian / Japanese, etc.",
       "difficulty": "Amateur" | "Bistro" | "Michelin Star",
       "prepTime": "15 mins",
       "cookTime": "20 mins",
       "totalTime": "35 mins",
       "servings": 2,
       "calories": 480,
       "chefSecret": "Executive chef technique pro tip",
       "winePairing": {
         "alcoholic": "2021 Sancerre or crisp Chablis",
         "nonAlcoholic": "Sparkling White Tea with Yuzu & Rosemary",
         "notes": "Sommelier tasting explanation of the harmony"
       }
     }
   }
2. "ingredients": {
     "type": "ingredients",
     "items": [
       { "name": "Sea Bass Fillet", "amount": 2, "unit": "fillets (6 oz each)", "category": "protein", "swapSuggestion": "Halibut or Cod" },
       { "name": "Asparagus", "amount": 1, "unit": "bunch", "category": "produce", "swapSuggestion": "Broccolini" }
     ]
   }
3. "steps": {
     "type": "steps",
     "items": [
       { "stepNumber": 1, "instruction": "Pat sea bass skin completely bone-dry with paper towels.", "technique": "Mise-en-place", "timerSeconds": 0, "chefTip": "Dry skin is non-negotiable for shatteringly crisp crackling." },
       { "stepNumber": 2, "instruction": "Heat cast iron skillet to high until wisps of smoke appear, add oil, place fish skin-side down and press gently for 60 seconds.", "technique": "Pan-Sear", "timerSeconds": 60, "chefTip": "Gentle pressing prevents the skin from curling up." }
     ]
   }
4. "chart": {
     "type": "chart",
     "title": "Macronutrient Architecture",
     "data": [
       { "name": "Protein", "value": 42, "unit": "g" },
       { "name": "Carbohydrates", "value": 14, "unit": "g" },
       { "name": "Healthy Fats", "value": 22, "unit": "g" },
       { "name": "Dietary Fiber", "value": 5, "unit": "g" }
     ]
   }

Sequence:
Output exactly one "card" block first, followed by one "ingredients" block, followed by one "steps" block, followed by one "chart" block.
If the user is asking to refine an existing recipe in history, adapt the recipe accordingly and stream the refreshed complete blocks.`;

  let formattedHistory = [];
  if (history && history.length > 0) {
    formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
  }

  for (const modelToTry of preferredModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelToTry });
      const chat = model.startChat({
        history: formattedHistory,
        systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: 'text/plain',
        }
      });

      const resultStream = await chat.sendMessageStream(prompt);
      let buffer = '';

      for await (const chunk of resultStream.stream) {
        const text = chunk.text();
        buffer += text;

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line) {
            // Strip any accidental markdown backticks if model generated them
            const cleanLine = line.replace(/^```json|^```|```$/g, '').trim();
            if (cleanLine) {
              try {
                JSON.parse(cleanLine);
                res.write(`data: ${cleanLine}\n\n`);
                streamSucceeded = true;
              } catch (err) {
                // Buffer fragment
              }
            }
          }
        }
      }

      if (buffer.trim()) {
        const cleanLine = buffer.trim().replace(/^```json|^```|```$/g, '').trim();
        if (cleanLine) {
          try {
            JSON.parse(cleanLine);
            res.write(`data: ${cleanLine}\n\n`);
            streamSucceeded = true;
          } catch (err) {
            // ignore
          }
        }
      }

      if (streamSucceeded) {
        res.write('event: done\ndata: {}\n\n');
        res.end();
        return;
      }
    } catch (modelError) {
      console.warn(`Attempt with ${modelToTry} failed:`, modelError.message);
      // Try next model in preferred list
    }
  }

  // If all models failed
  console.error('All model attempts failed or threw error');
  res.write(`event: error\ndata: {"code": "PROVIDER_ERROR", "message": "Failed to stream from Gemini API"}\n\n`);
  res.end();
});

module.exports = router;
