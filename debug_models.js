const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI("AIzaSyCE1NjVylmvBxxERZ7Wfuzp3J7uZTfkPP0");
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
        console.log(JSON.stringify(models, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listModels();
