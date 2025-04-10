import React, { useState } from "react";
import "./QuizGenerator.css";

const QuizGenerator = () => {
  const [text, setText] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setSubmitted(false);
    const res = await fetch("http://localhost:8000/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    const parsed = parseQuizText(data.quiz);
    setQuizData(parsed);
    setLoading(false);
  };

  const parseQuizText = (text) => {
    const questions = text.split(/\n(?=\d+\.\s)/).filter(Boolean);
  
    return questions.map((block) => {
      const lines = block.trim().split("\n");
      const questionLine = lines[0].replace(/^\d+\.\s*/, "").trim();
      const options = lines.slice(1, 5).map(line => line.trim());
      const answerLine = lines.find(line => /^Answer:/i.test(line));
      const correctLetter = answerLine ? answerLine.split(":")[1].trim()[0] : null;
      const correctOption = options.find(opt => opt.startsWith(correctLetter));
  
      return {
        question: questionLine,
        options,
        correct: correctOption
      };
    });
  };

  const handleSelect = (qIndex, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="quiz-generator">
      <h2>AI Quiz Generator</h2>
      <div className="textarea-wrapper">
        <textarea
          placeholder="Paste your text to generate a quiz..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={generateQuiz} disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </div>

      {quizData && (
        <div className="quiz-result">
          <h3>Your Quiz</h3>
          {quizData.map((q, i) => (
            <div key={i} className="question-block">
              <p className="question">{i + 1}. {q.question}</p>
              {q.options.map((opt, j) => {
                const isCorrect = q.correct && opt.startsWith(q.correct);
                const isSelected = selectedAnswers[i] === opt;
                const isWrong = submitted && isSelected && !isCorrect;
                const isRight = submitted && isSelected && isCorrect;

                return (
                  <label
                    key={j}
                    className={`option ${isRight ? "correct" : ""} ${isWrong ? "incorrect" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={opt}
                      disabled={submitted}
                      checked={isSelected}
                      onChange={() => handleSelect(i, opt)}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          ))}
          {!submitted && (
            <button style={{ marginTop: "1rem" }} onClick={handleSubmit}>
              Submit Answers
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
