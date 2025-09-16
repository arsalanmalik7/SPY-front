import React from 'react';
import { X, Check } from 'lucide-react';
import Button from './button';

const ReviewMistakesPanel = ({
  isOpen,
  onClose,
  mistakes = [],
  currentIndex = 0,
  total = 0,
  onPrev,
  onNext,
  onReturnSummary,
}) => {
  if (!isOpen) return null;

  
  const currentMistake = mistakes[currentIndex];
  console.log('Current Mistake:', currentMistake);

  return (
    <div className="fixed inset-0 z-[200] w-full h-full bg-[#fcf7ec] overflow-auto">
      {/* Header */}
      <div className="relative w-full max-w-8xl mx-auto pt-8 pb-2 px-4 sm:px-8">
        <h2 className="text-lg sm:text-xl font-semibold text-black mb-1 text-left">Review Mistakes</h2>
        <p className="text-xs sm:text-sm text-gray-600 text-left">
          Question {currentIndex + 1} of {total}
        </p>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-4 sm:right-8 text-gray-500 hover:text-red-500 p-1 rounded-full">
          <X size={24} />
        </button>
      </div>

      {/* Current Mistake */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4 sm:px-8 mt-2">
        {mistakes.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-8">No mistakes to review.</div>
        ) : (
          <div className="border border-gray-400 rounded-lg bg-white w-full">
            <div className="px-4 py-4">
              <div className="text-base sm:text-lg font-semibold text-black mb-2">
                {(() => {
                  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
                  const question = currentMistake.question;
                  // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                  const regex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg|jfif))|(\/uploads\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg|jfif))/gi;
                  const parts = [];
                  let lastIndex = 0;
                  let match;
                  let key = 0;
                  while ((match = regex.exec(question)) !== null) {
                    // Add text before the image
                    if (match.index > lastIndex) {
                      parts.push(<span key={key++}>{question.slice(lastIndex, match.index)}</span>);
                    }
                    // Remove trailing punctuation from the matched URL
                    let url = match[1] ? match[1] : `${baseUrl}${match[2]}`;
                    url = url.replace(/[.,!?;:]+$/, '');
                    parts.push(
                      <img
                        key={key++}
                        src={url}
                        alt="question"
                        className="mx-auto my-2 block max-h-52"
                      />
                    );
                    lastIndex = regex.lastIndex;
                  }
                  // Add any remaining text
                  if (lastIndex < question.length) {
                    parts.push(<span key={key++}>{question.slice(lastIndex)}</span>);
                  }
                  return parts;
                })()}

              </div>
              <div className="flex items-center gap-2 mb-1">
                <X size={18} className="text-[#C1121F]" />
                <span className="text-sm sm:text-base text-[#C1121F] font-semibold">
                  Your answer: {currentMistake?.userAnswer?.startsWith('http') || currentMistake?.userAnswer?.startsWith('/uploads/') ? (
                    <img className="mx-auto my-2 block max-h-52" src={currentMistake?.userAnswer?.startsWith('http') ? currentMistake.userAnswer : process.env.REACT_APP_IMAGE_BASE_URL + currentMistake.userAnswer} alt="option" />
                  ) : (
                    <span className="text-base sm:text-lg text-black font-medium leading-tight break-words ">{currentMistake.userAnswer}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-[#FFD600]" />
                <span className="text-sm sm:text-base text-[#FFD600] font-semibold">
                  Correct answer: {currentMistake?.correctAnswer?.startsWith('http') || currentMistake?.correctAnswer?.startsWith('/uploads/') ? (
                    <img className="mx-auto my-2 block max-h-52" src={currentMistake?.correctAnswer?.startsWith('http') ? currentMistake.correctAnswer : process.env.REACT_APP_IMAGE_BASE_URL + currentMistake.correctAnswer} alt="option" />
                  ) : (
                    <span className="text-base sm:text-lg text-black font-medium leading-tight break-words ">{currentMistake.correctAnswer}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 mb-8 px-4 sm:px-8">
        <Button
          variant="secondary"
          className="w-full sm:w-auto border border-gray-400 text-black bg-white hover:bg-gray-100"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          &#8592; Previous Mistake
        </Button>
        <Button
          variant="primary"
          className="w-full sm:w-auto bg-[#FFD600] text-black font-semibold border border-[#FFD600] hover:bg-[#ffe066]"
          onClick={onReturnSummary}
        >
          Return to Lesson Summary
        </Button>
        <Button
          variant="secondary"
          className="w-full sm:w-auto border border-gray-400 text-black bg-white hover:bg-gray-100"
          onClick={onNext}
          disabled={currentIndex === total - 1}
        >
          Next Mistake &#8594;
        </Button>
      </div>
    </div>
  );
};

export default ReviewMistakesPanel; 