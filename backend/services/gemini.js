const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});

async function askGemini(text) {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text }] }],
    });
    return result.response.text();
}

module.exports = { askGemini };
