import React, { useState } from 'react';
import { QuizQuestion } from '../App';

interface QuizProps {
  quiz: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const question = quiz[current];

  const handleSelect = (idx: number) => {
    setSelected((s) =>
      s.includes(idx) ? s.filter((i) => i !== idx) : [...s, idx]
    );
  };

  const handleSubmit = () => {
    const correct = question.correctAnswerIndices.slice().sort().toString();
    if (selected.slice().sort().toString() === correct) setScore((s) => s + 1);
    if (current + 1 < quiz.length) {
      setCurrent(current + 1);
      setSelected([]);
    } else {
      setShowScore(true);
    }
  };

  if (showScore) {
    return (
      <div>
        <h2>Quiz Complete</h2>
        <p>{score} of {quiz.length} correct</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Question {current + 1}</h2>
      <p>{question.question}</p>
      <ul>
        {question.answers.map((ans, idx) => (
          <li key={idx}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(idx)}
                onChange={() => handleSelect(idx)}
              />{ans}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Quiz;