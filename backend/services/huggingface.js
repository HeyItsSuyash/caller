const axios = require('axios');

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

if (!HF_API_KEY) {
    console.warn("⚠️ Missing HUGGINGFACE_API_KEY environment variable. AI responses will fail.");
}

/**
 * Generates a response from Hugging Face Mistral-7B.
 * @param {string} userText - The user's input.
 * @param {string} systemInstruction - The persona's system instruction.
 * @returns {Promise<string>} - The AI's text response.
 */
async function askHuggingFace(userText, systemInstruction) {
    try {
        if (!HF_API_KEY) throw new Error("Missing HUGGINGFACE_API_KEY");

        // Construct Mistral-7B-Instruct prompt
        // Format: <s>[INST] System Instruction + User Input [/INST]
        // Note: Mistral doesn't have a separate "System" role in the same way as OpenAI, 
        // but we can prepend it to the instruction block.

        const prompt = `<s>[INST] ${systemInstruction}\n\nUser: ${userText} [/INST]`;

        console.log(`[HuggingFace] Sending request to Mistral-7B...`);
        const response = await axios.post(
            MODEL_URL,
            {
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150, // Keep responses short
                    temperature: 0.7,
                    return_full_text: false // Only return the generated part
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // HF Inference API returns an array: [{ generated_text: "..." }]
        let generatedText = "";
        if (Array.isArray(response.data) && response.data.length > 0) {
            generatedText = response.data[0].generated_text;
        } else if (response.data && response.data.generated_text) {
            generatedText = response.data.generated_text;
        }

        // Clean up text if needed (sometimes it includes the prompt if return_full_text is true, but we set it to false)
        generatedText = generatedText.trim();

        console.log(`[HuggingFace] Reply: "${generatedText}"`);
        return generatedText;

    } catch (error) {
        console.error("[HuggingFace Error]", error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { askHuggingFace };
