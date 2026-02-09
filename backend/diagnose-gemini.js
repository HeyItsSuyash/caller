const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY");
    process.exit(1);
}

const MODELS_TO_TEST = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro",
    "gemini-pro"
];

const API_VERSIONS = [undefined, 'v1', 'v1beta']; // undefined = default

async function testConnection() {
    console.log("🔍 Starting Gemini API Diagnostics...");
    console.log(`🔑 Key length: ${API_KEY.length} (ends with ${API_KEY.slice(-4)})`);

    // Test 1: Check SDK Version
    try {
        const pkg = require('@google/generative-ai/package.json');
        console.log(`📦 SDK Version: ${pkg.version}`);
    } catch (e) { console.log("📦 SDK Version: Unknown"); }

    for (const version of API_VERSIONS) {
        console.log(`\n--- Testing API Version: ${version || 'Default'} ---`);

        // Note: SDK constructor doesn't officially document apiVersion in all places, 
        // but we can try passing it if the SDK supports custom client config, 
        // OR we just rely on what the model returns. 
        // The standard SDK usually defaults to v1beta or v1 depending on version.

        const clientConfig = version ? { apiVersion: version } : {};
        const genAI = new GoogleGenerativeAI(API_KEY);

        // There isn't a clean way to force version in the constructor in standard SDK,
        // it's often bound to the method or model.
        // However, we can test model availability directly.

        for (const modelName of MODELS_TO_TEST) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName }, clientConfig);
                const result = await model.generateContent("Test.");
                if (result && result.response) {
                    console.log(`✅ OK`);
                } else {
                    console.log(`❓ Empty Response`);
                }
                // If one works, we are good?
            } catch (e) {
                const err = e.message.split('\n')[0];
                if (err.includes('404')) {
                    console.log(`❌ 404 Not Found`);
                } else if (err.includes('400')) {
                    console.log(`❌ 400 Bad Request (Auth?)`);
                } else {
                    console.log(`❌ Error: ${err}`);
                }
            }
        }
    }
}

testConnection();
