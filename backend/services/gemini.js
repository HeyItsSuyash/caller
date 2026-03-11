const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn("⚠️ Missing GEMINI_API_KEY environment variable. AI responses will fail.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generates a response from Gemini.
 * @param {string} userText - The user's input.
 * @param {string} systemInstruction - The persona's system instruction.
 * @returns {Promise<string>} - The AI's text response.
 */
async function askGemini(userText, systemInstruction) {
    try {
        if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

        console.log(`[Gemini] Sending request to Gemini 2.5 Flash...`);
        console.log(`[Gemini] Prompt context: "${systemInstruction}"`);
        console.log(`[Gemini] User input: "${userText}"`);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        const result = await model.generateContent(userText);
        const response = await result.response;
        let generatedText = response.text();

        generatedText = generatedText.trim();

        console.log(`[Gemini] Reply received: "${generatedText}"`);
        return generatedText;

    } catch (error) {
        console.error("[Gemini Error]", error.message || error);
        throw error;
    }
}

/**
 * Streams AI response from Gemini.
 */
async function* askGeminiStream(userText, systemInstruction, history = []) {
    try {
        if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
            generationConfig: {
                maxOutputTokens: 80, // Optimized for short voice responses
            }
        });

        // Format history for Gemini SDK if needed
        // Assuming history is [{role: 'user'|'ai', content: '...'}]
        const chat = model.startChat({
            history: history.slice(0, -1).map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }],
            })),
        });

        const result = await chat.sendMessageStream(userText);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText;
        }
    } catch (error) {
        console.error("[Gemini Stream Error]", error.message);
        yield "I'm sorry, I'm having trouble thinking right now.";
    }
}

module.exports = { askGemini, askGeminiStream };
