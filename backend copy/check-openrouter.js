async function getLiveFreeModels() {
    try {
        console.log("Checking OpenRouter's live database for free models...");
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();

        // Filter for models that cost exactly $0.00
        const freeModels = data.data.filter(model => 
            parseFloat(model.pricing.prompt) === 0 && 
            parseFloat(model.pricing.completion) === 0
        );

        console.log(`\n✅ FOUND ${freeModels.length} FREE MODELS ONLINE RIGHT NOW:\n`);
        
        // Print the top 10 most context-rich free models
        freeModels
            .sort((a, b) => b.context_length - a.context_length)
            .slice(0, 10)
            .forEach(model => {
                console.log(`- "${model.id}"`);
            });

        console.log("\n👉 Copy ONE of these exact strings and paste it into your ai-controller.js!\n");

    } catch (error) {
        console.error("Error fetching models:", error.message);
    }
}

getLiveFreeModels();