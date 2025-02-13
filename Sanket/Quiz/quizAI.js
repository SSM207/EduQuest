const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
console.log("Loaded API Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const genAI = new GoogleGenerativeAI("AIzaSyCQldMge1O35jvnekdrSRm2kPcBqwulgvo");

// 

async function generateQuiz(topic) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Generate a multiple-choice quiz on the topic: "${topic}". 
        Provide 5-10 questions, each with 4 options and the correct answer.
        Return the response in valid JSON format without markdown.
        Example:
        [
          {"question": "What is AI?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "A"},
          ...
        ]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // ✅ Remove Markdown (` ```json `) if present
        let cleanedText = response.text().replace(/```json|```/g, "").trim();

        return JSON.parse(cleanedText); // ✅ Now it should be valid JSON
    } catch (error) {
        console.error("❌ Error generating quiz:", error);
        throw error;
    }
}


module.exports = { generateQuiz };
