import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// --- Initialize the AI Client ---
// --- Initialize the AI Client ---
let genAI;
try {
    // --- THIS IS THE DEFINITIVE FIX ---
    // Manually force the correct API endpoint to override any rogue system settings.
    const clientOptions = {
        baseURL: "https://generativelanguage.googleapis.com/v1/",
    };

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, clientOptions);
    console.log("Successfully initialized Gemini AI client with a forced, correct API endpoint.");

} catch (error) {
    console.error("CRITICAL ERROR: Failed to initialize client.", error.message);
    process.exit(1);
}

// --- The Main Function to Run the Test ---
async function runTest() {
    try {
        console.log("Attempting to call the Gemini API...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "What is the capital of India?";

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log("\n--- SUCCESS! API CALL WORKED ---\n");
        console.log(text);

    } catch (error) {
        console.error("\n--- ERROR: API CALL FAILED ---\n");
        console.error(error);
    }
}

// Run the test
runTest();