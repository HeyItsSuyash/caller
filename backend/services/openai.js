const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
    // throw new Error("Missing OPENAI_API_KEY environment variable");
    console.warn("Missing OPENAI_API_KEY environment variable. AI features will fail.");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a response from OpenAI based on the user's input and conversation history.
 * @param {string} userText - The user's input text.
 * @param {Array} history - Array of { role: 'user' | 'ai', content: string }.
 * @param {string} systemInstruction - The persona's system instruction.
 * @returns {Promise<string>} - The AI's text response.
 */
async function generateReply(userText, history, systemInstruction) {
    try {
        // Convert history to OpenAI format
        const messages = [
            { role: "system", content: `${systemInstruction}\n\nKeep natural. Plain text only. NO MARKDOWN. Max 2 sentences.` }
        ];

        history.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });

        messages.push({ role: "user", content: userText });

        console.log(`[OpenAI] Sending request to model: gpt-4o-mini`);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 150, // Keep it short for voice
            temperature: 0.7,
        });

        const text = completion.choices[0].message.content.trim();
        console.log(`[OpenAI] Reply generated: "${text}"`);
        return text;

    } catch (error) {
        console.error("[OpenAI Error]", error);
        throw error;
    }
}

module.exports = { generateReply };
