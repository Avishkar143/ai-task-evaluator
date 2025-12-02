require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Just try to generate simple text to prove it works
    const result = await model.generateContent("Hello");
    console.log("Success! Model works:", result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
