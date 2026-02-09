const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use standard "gemini-1.5-flash" model (Stable) with forced v1 API version
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

/**
 * Generates a response from Gemini based on the user's input and conversation history.
 * @param {string} userText - The user's input text.
 * @param {Array} history - Array of { role: 'user' | 'ai', content: string }.
 * @param {string} systemInstruction - The persona's system instruction.
 * @returns {Promise<string>} - The AI's text response.
 */
async function generateReply(userText, history, systemInstruction) {
    try {
        // Construct prompt with history context
        // Note: The simple `generateContent` method is stateless, so we provide context manually.
        // Alternatively, we could use `startChat`, but manual prompt construction is robust for turn-based.

        let prompt = `SYSTEM INSTRUCTION: ${systemInstruction}\n\nCONVERSATION HISTORY:\n`;

        history.forEach(msg => {
            const role = msg.role === 'user' ? 'User' : 'AI';
            prompt += `${role}: ${msg.content}\n`;
        });

        prompt += `\nUSER SAID: "${userText}"\n\nGenerate a natural, short response (max 2 sentences). Plain text only. NO MARKDOWN.`;

        console.log(`[Gemini] Sending request to model: gemini-1.5-flash-latest`);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log(`[Gemini] Reply generated: "${text}"`);
        return text;
    } catch (error) {
        console.error("[Gemini Error]", error);
        throw error;
    }
}

module.exports = { generateReply };
