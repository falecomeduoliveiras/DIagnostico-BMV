import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DIAGNOSTIC_QUESTIONS } from '../questions';

const BrandingQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const category = 'branding';
  const questions = DIAGNOSTIC_QUESTIONS[category];

  useEffect(() => {
    const storedAnswers = localStorage.getItem('diagnosticAnswers');
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = { ...answers, [`${category}-${currentQuestionIndex}`]: selectedOption };
    setAnswers(newAnswers);
    localStorage.setItem('diagnosticAnswers', JSON.stringify(newAnswers));
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/quiz/marketing');
    }
  };

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Etapa: Branding</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-[#00A9FF] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner min-h-[300px]">
        <h3 className="text-xl font-semibold text-gray-700 mb-5 text-center">{question.question}</h3>
        <div className="flex flex-col space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option.score;
            return (
              <div
                key={index}
                onClick={() => setSelectedOption(option.score)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-4 ${isSelected ? 'bg-blue-100 border-[#00A9FF]' : 'bg-white border-gray-200 hover:bg-blue-50'}`}>
                <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-[#00A9FF] bg-white' : 'border-gray-300'} flex items-center justify-center`}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-[#00A9FF]"></div>}
                </div>
                <span>{option.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="bg-[#00A9FF] text-white font-bold py-3 px-12 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default BrandingQuiz;
