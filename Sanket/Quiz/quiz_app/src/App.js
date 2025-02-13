import React, { useState } from "react";
import axios from 'axios';

function App() {
    const [topic, setTopic] = useState("");
    const [quiz, setQuiz] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    //There are 3 fectch functions try experimenting all of 3 and check which one works

    // const fetchQuiz = async () => {
    //     const response = await axios.post("http://localhost:5000/generate-quiz", { topic });
    //     // const response = await axios.post("http://localhost:5000/generate-quiz", { topic });

    //     setQuiz(response.data.quiz);
    //     setAnswers({});
    // };


    const fetchQuiz = async () => {
      try {
          const response = await axios.post("http://localhost:5000/generate-quiz", { topic });
          setQuiz(response.data.quiz);
          setAnswers({});
          setScore(null); // Reset score when new quiz starts
      } catch (error) {
          if (error.response) {
              // 🔹 Server responded with a status outside 2xx
              console.error("Axios Error - Response Data:", error.response.data);
              console.error("Axios Error - Status Code:", error.response.status);
          } else if (error.request) {
              // 🔹 No response was received
              console.error("Axios Error - No Response:", error.request);
          } else {
              // 🔹 Request was not sent properly
              console.error("Axios Error - Setup:", error.message);
          }
      }
  };

//   const fetchQuiz = async () => {
//     try {
//         const response = await fetch("http://localhost:5000/generate-quiz", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ topic }),
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setQuiz(data.quiz);
//     } catch (error) {
//         console.error("Fetch Error:", error);
//     }
// };

  

    const handleAnswer = (qIndex, answer) => {
        setAnswers({ ...answers, [qIndex]: answer });
    };

    const submitQuiz = async () => {
        const correctAnswers = quiz.map(q => q.answer);
        const response = await axios.post("http://localhost:5000/submit-quiz", {
            username: "Test User",
            topic,
            answers: Object.values(answers),
            correctAnswers
        });
        setScore(response.data.message);
    };

    return (
        <div>
            <h1>AI Quiz Generator</h1>
            <input type="text" placeholder="Enter Topic" value={topic} onChange={e => setTopic(e.target.value)} />
            <button onClick={fetchQuiz}>Generate Quiz</button>

            {quiz.length > 0 && (
                <div>
                    {quiz.map((q, index) => (
                        <div key={index}>
                            <p>{q.question}</p>
                            {q.options.map((option, optIndex) => (
                                <label key={optIndex}>
                                    <input
                                        type="radio"
                                        name={`q${index}`}
                                        value={option}
                                        onChange={() => handleAnswer(index, option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    ))}
                    <button onClick={submitQuiz}>Submit Quiz</button>
                </div>
            )}

            {score && <h2>{score}</h2>}
        </div>
    );
}

export default App;
