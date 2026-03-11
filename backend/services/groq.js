const Groq = require('groq-sdk');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

/**
 * Streams AI response from Groq.
 */
async function* askGroqStream(userText, systemInstruction, history = []) {
    try {
        if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

        const messages = [
            { role: 'system', content: systemInstruction },
            ...history.map(h => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.content,
            })),
            { role: 'user', content: userText }
        ];

        const stream = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 80,
            top_p: 1,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                yield content;
            }
        }
    } catch (error) {
        console.error("[Groq Stream Error]", error.message);
        yield "I'm sorry, I'm having trouble thinking right now.";
    }
}

module.exports = { askGroqStream };
