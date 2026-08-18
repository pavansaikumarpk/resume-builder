// test-gemini.js

require('dotenv').config();
const https = require('https' );

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not found in your .env file.");
    process.exit(1);
}

// ** This is the direct, dependency-free request to list models **
const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

console.log("--- Starting Final Diagnostic: Fetching Available Models Directly ---");
console.log(`Connecting to: ${url}`);

const req = https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode >= 400) {
            console.error("\n--- DIAGNOSTIC FAILED ---");
            console.error(`HTTP error! Status: ${res.statusCode}`);
            console.error("Response:", data);
            console.error("-------------------------\n");
            console.log("This confirms a critical issue with your Google Cloud Project or API Key. Please contact Google Support.");
        } else {
            console.log("\n--- DIAGNOSTIC SUCCESS! ---");
            const models = JSON.parse(data).models;
            console.log("Your API Key has access to the following models for 'generateContent':");
            
            let foundModels = false;
            models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                    foundModels = true;
                }
            });

            if (foundModels) {
                console.log("\nSUCCESS: Please copy one of the EXACT model names (e.g., 'gemini-pro') and use it in your ai-controller.js file.");
            } else {
                console.log("No usable models found. The project is not configured correctly.");
            }
            console.log("-----------------------------\n");
        }
    });
});

req.on('error', (e) => {
    console.error("\n--- DIAGNOSTIC FAILED (Network Error) ---");
    console.error(`Problem with request: ${e.message}`);
    console.error("-------------------------------------------\n");
});