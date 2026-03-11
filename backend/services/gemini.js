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

        console.log(`[Gemini] Sending request to Gemini 1.5 Flash...`);
        console.log(`[Gemini] Prompt context: "${systemInstruction}"`);
        console.log(`[Gemini] User input: "${userText}"`);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
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

module.exports = { askGemini };
