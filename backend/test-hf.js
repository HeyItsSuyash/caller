require('dotenv').config();
const { askHuggingFace } = require('./services/huggingface');

async function test() {
    console.log("🚀 Testing Hugging Face Service...");
    const systemInstruction = "You are a helpful assistant.";
    const userText = "Hello, who are you?";

    try {
        const reply = await askHuggingFace(userText, systemInstruction);
        console.log("\n✅ Test Success!");
        console.log("Final Output:", reply);
    } catch (error) {
        console.log("\n❌ Test Failed!");
    }
}

test();
