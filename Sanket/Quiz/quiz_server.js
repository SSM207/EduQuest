const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { generateQuiz } = require("./quizAI");
// const { saveToExcel } = require("./excelReport");
require("dotenv").config();

const app = express();
// app.use(cors());
app.use(bodyParser.json());


// const cors = require("cors");

app.use(cors({
    origin: "http://localhost:3000", // Allow frontend requests
    methods: "GET,POST",
    credentials: true
}));


const PORT = process.env.PORT || 5000;

// Generate Quiz Route
app.post("/generate-quiz", async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ success: false, message: "Topic is required" });
    }

    try {
        const quiz = await generateQuiz(topic);
        res.json({ success: true, quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Submit Quiz and Save Results
app.post("/submit-quiz", (req, res) => {
    const { username, topic, answers, correctAnswers } = req.body;

    let score = 0;
    answers.forEach((ans, idx) => {
        if (ans === correctAnswers[idx]) score++;
    });

    const resultData = { username, topic, score, totalQuestions: correctAnswers.length };
    saveToExcel(resultData);

    res.json({ success: true, message: `You scored ${score} / ${correctAnswers.length}` });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
