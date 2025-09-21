import React, { useState, useEffect } from "react";
import ProgressBar from "./progressBar";
import Card from "./card";
import Badge from "./badge";
import { X, XCircle, Info, BookOpen } from "lucide-react";
import LessonCompletePanel from "./LessonCompletePanel";
import ReferenceMenuPanel from "./ReferenceWineMenu";
import ReviewMistakesPanel from "./ReviewMistakesPanel";
import Button from "./button";
import { submitLessonProgress } from "../../services/lessonProgress";

// Generate 25 demo questions
const FOOD_QUESTIONS = [
  {
    id: 101,
    question: "What is the main ingredient in Margherita Pizza?",
    type: "single_select",
    options: ["Tomato", "Potato", "Pumpkin", "Carrot"],
    difficulty: "Easy",
    hint: "It is a classic Italian ingredient.",
    error: "Incorrect. Try again.",
    correct: 0,
  },
  {
    id: 102,
    question: "Select all ingredients in Caesar Salad:",
    type: "multiple_choice",
    options: ["Lettuce", "Croutons", "Chicken", "Chocolate"],
    difficulty: "Medium",
    hint: "Think about a classic Caesar Salad.",
    error: "Incorrect. Try again.",
    correct: [0, 1, 2],
  },
  {
    id: 103,
    question: "Fill in the blank: The main cheese in pizza is _____.",
    type: "fill_in_the_blank",
    options: [],
    difficulty: "Easy",
    hint: "It starts with M.",
    error: "Incorrect. Try again.",
    correct: "Mozzarella",
  },
  {
    id: 104,
    question: "Write a short answer: Why is breakfast important?",
    type: "short_answer",
    options: [],
    difficulty: "Medium",
    hint: "Think about energy and health.",
    error: "Please write a short answer.",
    correct: "",
  },
  {
    id: 105,
    question: "Is Tiramisu a dessert? (True/False)",
    type: "true_false",
    options: ["True", "False"],
    difficulty: "Easy",
    hint: "It is a famous Italian sweet.",
    error: "Incorrect. Try again.",
    correct: 0,
  },
  {
    id: 106,
    question: "Describe your favorite dish in a few words.",
    type: "text",
    options: [],
    difficulty: "Easy",
    hint: "Write anything you like.",
    error: "Please enter your answer.",
    correct: "",
  },
  {
    id: 201,
    question: "Does Spaghetti Carbonara contain any health restrictions?",
    type: "single",
    options: ["Yes", "No"],
    difficulty: "Easy",
    hint: "Check if the dish contains any common allergens.",
    error: "Incorrect. Click the correct answer to move forward.",
    correct: 0,
  },
  {
    id: 202,
    question:
      "Choose all the health restrictions that apply to Spaghetti Carbonara:",
    type: "multi",
    options: ["Gluten", "Dairy", "Eggs", "Pork"],
    difficulty: "Medium",
    hint: "Think about the main ingredients in Carbonara.",
    error: "Incorrect. Click the correct answers to move forward.",
    correct: [0, 1, 2, 3],
  },
  {
    id: 203,
    question: "What is the price of Spaghetti Carbonara?",
    type: "single",
    options: ["$16.99", "$18.99", "$21.99", "$23.99"],
    difficulty: "Easy",
    hint: "Check the menu for the listed price.",
    error: "Incorrect. Click the correct answer to move forward.",
    correct: 1,
  },
];

const DIFFICULTY_COLORS = {
  Easy: "bg-yellow-200 text-black",
  Medium: "bg-yellow-200 text-black",
  Hard: "bg-yellow-200 text-black",
};

const WineQuizPanel = ({
  isOpen,
  onClose,
  unit = "Food Unit 1",
  chapter = "Chapter 2: Food Prices",
  questions = FOOD_QUESTIONS,
  total = 25,
  lessonUuid,
  startIndex = 0,
  onLessonComplete,
  allChaptersForUnit = [],
  menuData,
  attemptedQuestions,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showHint, setShowHint] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showError, setShowError] = useState(false);
  const [validation, setValidation] = useState("");
  const [showLessonComplete, setShowLessonComplete] = useState(false);
  const [isReferencePanelOpen, setIsReferencePanelOpen] = useState(false);
  const [showReviewMistakes, setShowReviewMistakes] = useState(false);
  const [reviewMistakeIndex, setReviewMistakeIndex] = useState(0);
  const [progress, setProgress] = useState(startIndex + 1);
  const [answered, setAnswered] = useState(false);
  const [lessonCompleteData, setLessonCompleteData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allAnswers, setAllAnswers] = useState(
    Array(questions.length).fill(null)
  );
  const [startTime, setStartTime] = useState(null);
  const [performedQuestions, setPerformedQuestions] = useState([]);

  // Get the menu data from the lesson data
  const currentMenu = menuData;
  const q = questions[currentIndex];

  useEffect(() => {
    setPerformedQuestions((prev) => {
      if (!prev.includes(q?._id)) {
        return [...prev, q?._id];
      }
      return prev;
    });
  }, [q]);

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
    }
  }, [isOpen]);

  useEffect(() => {
    if (showLessonComplete) {
      setIsReferencePanelOpen(false);
    }
  }, [showLessonComplete]);
  if (!isOpen) return null;

  const sel = selected;
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  const handleOption = (optIdx, type) => {
    if (answered) return;
    let newSelected;
    if (type === "multi" || type === "multiple_choice") {
      const prevArr = sel || [];
      if (prevArr.includes(optIdx)) {
        newSelected = prevArr.filter((i) => i !== optIdx);
      } else {
        newSelected = [...prevArr, optIdx];
      }
    } else if (
      type === "fill_in_the_blank" ||
      type === "short_answer" ||
      type === "text"
    ) {
      newSelected = [optIdx];
    } else {
      newSelected = [optIdx];
    }
    setSelected(newSelected);
    setShowError(false);
    setValidation("");
    // Update allAnswers for the real question index
    setAllAnswers((prevAll) => {
      const updated = [...prevAll];
      updated[currentIndex] = newSelected;
      return updated;
    });
  };

  const handleShowHint = () => {
    setShowHint((prev) => !prev);
  };

  const handleNext = () => {
    setAnswered(false);
    setSelected(allAnswers[currentIndex + 1] || []);
    setShowHint(false);
    setValidation("");
    setCurrentIndex((prev) => prev + 1);
    setProgress((prev) => Math.min(prev + 1, questions.length));
  };

  const handlePrev = () => {
    setAnswered(false);
    setSelected(allAnswers[currentIndex - 1] || []);
    setShowHint(false);
    setValidation("");
    setCurrentIndex((prev) => prev - 1);
    setProgress((prev) => Math.max(prev - 1, 1));
  };

  const handleCompleteLesson = async () => {
    setIsSubmitting(true);
    try {
      // Calculate time spent in seconds
      const endTime = Date.now();
      const timeSpent = startTime
        ? Math.round((endTime - startTime) / 1000)
        : 0;

      // Calculate score based on correct answers
      const totalQuestions = questions.length;
      const correctAnswers = questions.reduce((total, q, idx) => {
        const userAns = allAnswers[idx] || [];
        if (
          q.type === "single" ||
          q.type === "single_select" ||
          q.type === "true_false"
        ) {
          const userAnswer =
            userAns[0] !== undefined ? q.options[userAns[0]] : "";
          const correctAnswer = q.correct[0];
          return total + (userAnswer === correctAnswer ? 1 : 0);
        } else if (q.type === "multi" || q.type === "multiple_choice") {
          const userSelectedOptions = userAns.map((index) => q.options[index]);
          const correctOptions = q.correct.map((index) => q.options[index]);
          const isCorrect =
            userSelectedOptions.length === correctOptions.length &&
            userSelectedOptions.every((option) =>
              correctOptions.includes(option)
            );
          return total + (isCorrect ? 1 : 0);
        } else if (
          q.type === "fill_in_the_blank" ||
          q.type === "short_answer" ||
          q.type === "text"
        ) {
          const userAnswer = userAns[0] || "";
          return (
            total +
            (userAnswer.toLowerCase().trim() === q.correct.toLowerCase().trim()
              ? 1
              : 0)
          );
        }
        return total;
      }, 0);

      // Calculate score as percentage
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      // Format answers for submission with actual values instead of indices
      const currentSessionAnswers = questions.map((q, idx) => {
        const userAns = allAnswers[idx] || [];
        let answerValues;
        let isCorrect = false;

        if (
          q.type === "single" ||
          q.type === "single_select" ||
          q.type === "true_false"
        ) {
          answerValues =
            userAns[0] !== undefined ? [q.options[userAns[0]]] : [];
          isCorrect = answerValues[0] === q.options[q.correct];
        } else if (q.type === "multi" || q.type === "multiple_choice") {
          answerValues = userAns.map((index) => q.options[index]);
          const correctOptions = q.correct.map((index) => q.options[index]);
          isCorrect =
            answerValues.length === correctOptions.length &&
            answerValues.every((option) => correctOptions.includes(option));
        } else if (
          q.type === "fill_in_the_blank" ||
          q.type === "short_answer" ||
          q.type === "text"
        ) {
          answerValues = userAns[0] ? [userAns[0]] : [];
          isCorrect =
            answerValues[0]?.toLowerCase().trim() ===
            q.correct.toLowerCase().trim();
        }

        return {
          questionId: q.id,
          answer: answerValues,
          isCorrect,
        };
      });

      // Merge previous answers (from attemptedQuestions) with current session answers
      const previousAnswers = Array.isArray(attemptedQuestions)
        ? attemptedQuestions
        : [];
      const answers = [...previousAnswers, ...currentSessionAnswers];

      // Submit progress
      const response = await submitLessonProgress(lessonUuid, {
        score,
        timeSpent,
        answers,
      });

      // Show completion panel with API response data
      setShowLessonComplete(true);
      setLessonCompleteData(response);
    } catch (error) {
      console.error("Error submitting lesson progress:", error);
      // You may want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to build mistakes array
  const getMistakes = () => {
    return allAnswers
      .map((userAns, idx) => {
        const q = questions[idx];
        if (!q || !userAns) return null;
        let userAnswer, correctAnswer;
        if (
          q.type === "single" ||
          q.type === "single_select" ||
          q.type === "true_false"
        ) {
          userAnswer = userAns[0] !== undefined ? q.options[userAns[0]] : "";
          correctAnswer = q.correct[0];
          if (userAnswer === correctAnswer) return null;
        } else if (q.type === "multi" || q.type === "multiple_choice") {
          userAnswer = userAns.map((index) => q.options[index]).join(", ");
          correctAnswer = q.correct.map((index) => q.options[index]).join(", ");
          if (userAnswer === correctAnswer) return null;
        } else if (
          q.type === "fill_in_the_blank" ||
          q.type === "short_answer" ||
          q.type === "text"
        ) {
          userAnswer = userAns[0] || "";
          correctAnswer = q.correct[0];
          if (userAnswer === correctAnswer) return null;
        }
        return {
          question: q.question,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
        };
      })
      .filter(Boolean);
  };

  // Helper function to check if the current question is answered
  function isAnswered(q, sel) {
    if (!q) return false;
    if (
      q.type === "single" ||
      q.type === "single_select" ||
      q.type === "true_false"
    ) {
      return sel && sel.length > 0;
    } else if (q.type === "multi" || q.type === "multiple_choice") {
      return sel && sel.length > 0;
    } else if (
      q.type === "fill_in_the_blank" ||
      q.type === "short_answer" ||
      q.type === "text"
    ) {
      return sel && sel[0] && sel[0].toString().trim() !== "";
    }
    return false;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <ReferenceMenuPanel
        isOpen={isReferencePanelOpen}
        onClose={() => setIsReferencePanelOpen(false)}
        menuData={currentMenu}
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />
      {/* Quiz Panel */}
      {!showLessonComplete && (
        <div className="fixed inset-0 w-full h-full bg-[#fcf7ec] border-l border-gray-300 shadow-2xl z-[101] overflow-y-auto transition-transform duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#fcf7ec] sticky top-0 z-10">
            <div>
              <div className="text-lg sm:text-2xl text-black font-bold">
                {unit}, {chapter}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 p-1 rounded-full"
              >
                <X size={22} />
              </button>
            </div>
          </div>
          {/* Progress Bar and Question Count */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex flex-row items-center w-full gap-2">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap mr-2">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <ProgressBar
                value={progress}
                max={questions.length}
                showLabel={false}
                variant="primary"
                className="flex-1"
              />
            </div>
          </div>
          {/* Single Question */}
          <div className="space-y-6 px-1 sm:px-2 pb-8 max-w-2xl mx-auto">
            {q &&
              (() => {
                // Single Select
                if (q.type === "single" || q.type === "single_select") {
                  return (
                    <Card
                      key={q.id}
                      className="p-0 border border-blue-400 rounded-xl opacity-100"
                    >
                      <div className="flex flex-row items-start justify-between px-4 pt-4 pb-2 gap-2">
                        <div className="text-base sm:text-lg text-black font-medium leading-tight break-words flex-1 ">
                          {(() => {
                            const baseUrl =
                              process.env.REACT_APP_IMAGE_BASE_URL;
                            const question = q.question;
                            // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                            const regex =
                              /(https?:\/\/[^\s]+\.(?:[a-zA-Z0-9]+))|(\/uploads\/[^\s]+\.(?:[a-zA-Z0-9]+))/gi;
                            const parts = [];
                            let lastIndex = 0;
                            let match;
                            let key = 0;
                            while ((match = regex.exec(question)) !== null) {
                              // Add text before the image
                              if (match.index > lastIndex) {
                                parts.push(
                                  <span key={key++}>
                                    {question.slice(lastIndex, match.index)}
                                  </span>
                                );
                              }
                              // Remove trailing punctuation from the matched URL
                              let url = match[1]
                                ? match[1]
                                : `${baseUrl}${match[2]}`;
                              url = url.replace(/[.,!?;:]+$/, "");
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
                              parts.push(
                                <span key={key++}>
                                  {question.slice(lastIndex)}
                                </span>
                              );
                            }
                            return parts;
                          })()}
                        </div>
                        <Badge
                          className={`${
                            DIFFICULTY_COLORS[q.difficulty]
                          } px-3 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="px-4 pb-2">
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const selectedThis = sel[0] === optIdx;
                            return (
                              <label
                                key={optIdx}
                                className={`flex items-center border rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-all text-black text-sm sm:text-base font-medium break-words
                                ${
                                  selectedThis
                                    ? "bg-yellow-100 border-yellow-400"
                                    : "bg-white border-gray-300"
                                }
                                ${selectedThis ? "ring-2 ring-yellow-400" : ""}
                              `}
                              >
                                <input
                                  type="radio"
                                  name={`q${currentIndex}`}
                                  checked={selectedThis}
                                  onChange={() =>
                                    handleOption(optIdx, "single")
                                  }
                                  className="form-radio text-[#e11d48] focus:ring-[#e11d48] mr-2 sm:mr-3"
                                  disabled={answered}
                                />
                                {opt.startsWith("http") ||
                                opt.startsWith("/uploads/") ? (
                                  <div className="relative mx-auto my-2 block max-h-52">
                                    <img
                                      className="mx-auto my-2 block max-h-52"
                                      src={
                                        opt.startsWith("http")
                                          ? opt
                                          : process.env.REACT_APP_IMAGE_BASE_URL + opt
                                      }
                                      alt="option"
                                    />

                                    {opt.includes("default_image_wine") && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold text-center p-2 rounded">
                                        Please upload an image
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-base sm:text-lg text-black font-medium leading-tight break-words ">
                                    {opt}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      {showError && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{q.error}</span>
                        </div>
                      )}
                      {validation && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{validation}</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center">
                        <Info size={16} className="text-blue-400 mr-2" />
                        <button
                          onClick={handleShowHint}
                          className="text-sm sm:text-base text-[#3b2f13] hover:underline"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <span className="ml-2 text-sm sm:text-base text-blue-700">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                }
                // Multiple Choice
                else if (q.type === "multi" || q.type === "multiple_choice") {
                  return (
                    <Card
                      key={q.id}
                      className="p-0 border border-green-400 rounded-xl opacity-100"
                    >
                      <div className="flex flex-row items-start justify-between px-4 pt-4 pb-2 gap-2">
                        <div className="text-base sm:text-lg text-black font-medium leading-tight break-words flex-1 ">
                          {(() => {
                            const baseUrl =
                              process.env.REACT_APP_IMAGE_BASE_URL;
                            const question = q.question;
                            // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                            const regex =
                              /(https?:\/\/[^\s]+\.(?:[a-zA-Z0-9]+))|(\/uploads\/[^\s]+\.(?:[a-zA-Z0-9]+))/gi;
                            const parts = [];
                            let lastIndex = 0;
                            let match;
                            let key = 0;
                            while ((match = regex.exec(question)) !== null) {
                              // Add text before the image
                              if (match.index > lastIndex) {
                                parts.push(
                                  <span key={key++}>
                                    {question.slice(lastIndex, match.index)}
                                  </span>
                                );
                              }
                              // Remove trailing punctuation from the matched URL
                              let url = match[1]
                                ? match[1]
                                : `${baseUrl}${match[2]}`;
                              url = url.replace(/[.,!?;:]+$/, "");
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
                              parts.push(
                                <span key={key++}>
                                  {question.slice(lastIndex)}
                                </span>
                              );
                            }
                            return parts;
                          })()}
                        </div>
                        <Badge
                          className={`${
                            DIFFICULTY_COLORS[q.difficulty]
                          } px-3 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="px-4 pb-2">
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const selectedThis = sel.includes(optIdx);
                            return (
                              <label
                                key={optIdx}
                                className={`flex items-center border rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-all text-black text-sm sm:text-base font-medium break-words
                                ${
                                  selectedThis
                                    ? "bg-yellow-100 border-yellow-400"
                                    : "bg-white border-gray-300"
                                }
                                ${selectedThis ? "ring-2 ring-yellow-400" : ""}
                              `}
                              >
                                <input
                                  type="checkbox"
                                  name={`q${currentIndex}`}
                                  checked={selectedThis}
                                  onChange={() => handleOption(optIdx, "multi")}
                                  className="form-checkbox text-[#e11d48] focus:ring-[#e11d48] mr-2 sm:mr-3"
                                  disabled={answered}
                                />
                                <span className="flex items-center gap-2 w-full">
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      {showError && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{q.error}</span>
                        </div>
                      )}
                      {validation && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{validation}</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center">
                        <Info size={16} className="text-blue-400 mr-2" />
                        <button
                          onClick={handleShowHint}
                          className="text-sm sm:text-base text-[#3b2f13] hover:underline"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <span className="ml-2 text-sm sm:text-base text-blue-700">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                }
                // Fill in the Blank
                else if (q.type === "fill_in_the_blank") {
                  return (
                    <Card
                      key={q.id}
                      className="p-0 border border-orange-400 rounded-xl opacity-100"
                    >
                      <div className="flex flex-row items-start justify-between px-4 pt-4 pb-2 gap-2">
                        <div className="text-base sm:text-lg text-black font-medium leading-tight break-words flex-1 ">
                          {(() => {
                            const baseUrl =
                              process.env.REACT_APP_IMAGE_BASE_URL;
                            const question = q.question;
                            // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                            const regex =
                              /(https?:\/\/[^\s]+\.(?:[a-zA-Z0-9]+))|(\/uploads\/[^\s]+\.(?:[a-zA-Z0-9]+))/gi;
                            const parts = [];
                            let lastIndex = 0;
                            let match;
                            let key = 0;
                            while ((match = regex.exec(question)) !== null) {
                              // Add text before the image
                              if (match.index > lastIndex) {
                                parts.push(
                                  <span key={key++}>
                                    {question.slice(lastIndex, match.index)}
                                  </span>
                                );
                              }
                              // Remove trailing punctuation from the matched URL
                              let url = match[1]
                                ? match[1]
                                : `${baseUrl}${match[2]}`;
                              url = url.replace(/[.,!?;:]+$/, "");
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
                              parts.push(
                                <span key={key++}>
                                  {question.slice(lastIndex)}
                                </span>
                              );
                            }
                            return parts;
                          })()}
                        </div>
                        <Badge
                          className={`${
                            DIFFICULTY_COLORS[q.difficulty]
                          } px-3 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="px-4 pb-2">
                        <textarea
                          className="w-full border rounded-md px-3 py-2 text-black text-base"
                          rows={2}
                          placeholder="Fill the blank"
                          value={sel[0] || ""}
                          onChange={(e) =>
                            handleOption(e.target.value, "fill_in_the_blank")
                          }
                          disabled={answered}
                        />
                      </div>
                      {showError && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{q.error}</span>
                        </div>
                      )}
                      {validation && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{validation}</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center">
                        <Info size={16} className="text-blue-400 mr-2" />
                        <button
                          onClick={handleShowHint}
                          className="text-sm sm:text-base text-[#3b2f13] hover:underline"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <span className="ml-2 text-sm sm:text-base text-blue-700">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                }
                // Short Answer
                else if (q.type === "short_answer") {
                  return (
                    <Card
                      key={q.id}
                      className="p-0 border border-red-400 rounded-xl opacity-100"
                    >
                      <div className="flex flex-row items-start justify-between px-4 pt-4 pb-2 gap-2">
                        <div className="text-base sm:text-lg text-black font-medium leading-tight break-words flex-1 ">
                          {(() => {
                            const baseUrl =
                              process.env.REACT_APP_IMAGE_BASE_URL;
                            const question = q.question;
                            // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                            const regex =
                              /(https?:\/\/[^\s]+\.(?:[a-zA-Z0-9]+))|(\/uploads\/[^\s]+\.(?:[a-zA-Z0-9]+))/gi;
                            const parts = [];
                            let lastIndex = 0;
                            let match;
                            let key = 0;
                            while ((match = regex.exec(question)) !== null) {
                              // Add text before the image
                              if (match.index > lastIndex) {
                                parts.push(
                                  <span key={key++}>
                                    {question.slice(lastIndex, match.index)}
                                  </span>
                                );
                              }
                              // Remove trailing punctuation from the matched URL
                              let url = match[1]
                                ? match[1]
                                : `${baseUrl}${match[2]}`;
                              url = url.replace(/[.,!?;:]+$/, "");
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
                              parts.push(
                                <span key={key++}>
                                  {question.slice(lastIndex)}
                                </span>
                              );
                            }
                            return parts;
                          })()}
                        </div>
                        <Badge
                          className={`${
                            DIFFICULTY_COLORS[q.difficulty]
                          } px-3 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="px-4 pb-2">
                        <textarea
                          className="w-full border rounded-md px-3 py-2 text-black text-base"
                          rows={3}
                          placeholder="Short answer"
                          value={sel[0] || ""}
                          onChange={(e) =>
                            handleOption(e.target.value, "short_answer")
                          }
                          disabled={answered}
                        />
                      </div>
                      {showError && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{q.error}</span>
                        </div>
                      )}
                      {validation && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{validation}</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center">
                        <Info size={16} className="text-blue-400 mr-2" />
                        <button
                          onClick={handleShowHint}
                          className="text-sm sm:text-base text-[#3b2f13] hover:underline"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <span className="ml-2 text-sm sm:text-base text-blue-700">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                }
                // True/False
                else if (q.type === "true_false") {
                  return (
                    <Card
                      key={q.id}
                      className="p-0 border border-purple-400 rounded-xl opacity-100"
                    >
                      <div className="flex flex-row items-start justify-between px-4 pt-4 pb-2 gap-2">
                        <div className="text-base sm:text-lg text-black font-medium leading-tight break-words flex-1 ">
                          {(() => {
                            const baseUrl =
                              process.env.REACT_APP_IMAGE_BASE_URL;
                            const question = q.question;
                            // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                            const regex =
                              /(https?:\/\/[^\s]+\.(?:[a-zA-Z0-9]+))|(\/uploads\/[^\s]+\.(?:[a-zA-Z0-9]+))/gi;
                            const parts = [];
                            let lastIndex = 0;
                            let match;
                            let key = 0;
                            while ((match = regex.exec(question)) !== null) {
                              // Add text before the image
                              if (match.index > lastIndex) {
                                parts.push(
                                  <span key={key++}>
                                    {question.slice(lastIndex, match.index)}
                                  </span>
                                );
                              }
                              // Remove trailing punctuation from the matched URL
                              let url = match[1]
                                ? match[1]
                                : `${baseUrl}${match[2]}`;
                              url = url.replace(/[.,!?;:]+$/, "");
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
                              parts.push(
                                <span key={key++}>
                                  {question.slice(lastIndex)}
                                </span>
                              );
                            }
                            return parts;
                          })()}
                        </div>
                        <Badge
                          className={`${
                            DIFFICULTY_COLORS[q.difficulty]
                          } px-3 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="px-4 pb-2">
                        <div className="grid grid-cols-2 gap-2">
                          {["True", "False"].map((opt, optIdx) => {
                            const selectedThis = sel[0] === optIdx;
                            return (
                              <label
                                key={opt}
                                className={`flex items-center border rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-all text-black text-sm sm:text-base font-medium break-words
                                ${
                                  selectedThis
                                    ? "bg-yellow-100 border-yellow-400"
                                    : "bg-white border-gray-300"
                                }
                                ${selectedThis ? "ring-2 ring-yellow-400" : ""}
                              `}
                              >
                                <input
                                  type="radio"
                                  name={`q${currentIndex}`}
                                  checked={selectedThis}
                                  onChange={() =>
                                    handleOption(optIdx, "true_false")
                                  }
                                  className="form-radio text-[#e11d48] focus:ring-[#e11d48] mr-2 sm:mr-3"
                                  disabled={answered}
                                />
                                <span className="flex items-center gap-2 w-full">
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      {showError && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{q.error}</span>
                        </div>
                      )}
                      {validation && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{validation}</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center">
                        <Info size={16} className="text-blue-400 mr-2" />
                        <button
                          onClick={handleShowHint}
                          className="text-sm sm:text-base text-[#3b2f13] hover:underline"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <span className="ml-2 text-sm sm:text-base text-blue-700">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                }
                // Text
                else if (q.type === "text") {
                  return (
                    <Card
                      key={q.id}
                      className="p-0 border border-orange-400 rounded-xl opacity-100"
                    >
                      <div className="flex flex-row items-start justify-between px-4 pt-4 pb-2 gap-2">
                        <div className="text-base sm:text-lg text-black font-medium leading-tight break-words flex-1 ">
                          {(() => {
                            const baseUrl =
                              process.env.REACT_APP_IMAGE_BASE_URL;
                            const question = q.question;
                            // Regex to match either /uploads/... or https... image URLs, allowing for trailing punctuation
                            const regex =
                              /(https?:\/\/[^\s]+\.(?:[a-zA-Z0-9]+))|(\/uploads\/[^\s]+\.(?:[a-zA-Z0-9]+))/gi;
                            const parts = [];
                            let lastIndex = 0;
                            let match;
                            let key = 0;
                            while ((match = regex.exec(question)) !== null) {
                              // Add text before the image
                              if (match.index > lastIndex) {
                                parts.push(
                                  <span key={key++}>
                                    {question.slice(lastIndex, match.index)}
                                  </span>
                                );
                              }
                              // Remove trailing punctuation from the matched URL
                              let url = match[1]
                                ? match[1]
                                : `${baseUrl}${match[2]}`;
                              url = url.replace(/[.,!?;:]+$/, "");
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
                              parts.push(
                                <span key={key++}>
                                  {question.slice(lastIndex)}
                                </span>
                              );
                            }
                            return parts;
                          })()}
                        </div>
                        <Badge
                          className={`${
                            DIFFICULTY_COLORS[q.difficulty]
                          } px-3 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="px-4 pb-2">
                        <textarea
                          className="w-full border rounded-md px-3 py-2 text-black text-base"
                          rows={2}
                          placeholder="Type your answer"
                          value={sel[0] || ""}
                          onChange={(e) => handleOption(e.target.value, "text")}
                          disabled={answered}
                        />
                      </div>
                      {showError && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{q.error}</span>
                        </div>
                      )}
                      {validation && (
                        <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 mx-3 sm:mx-4 mt-2 text-sm">
                          <XCircle size={18} className="mr-2 text-red-500" />
                          <span>{validation}</span>
                        </div>
                      )}
                      <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center">
                        <Info size={16} className="text-blue-400 mr-2" />
                        <button
                          onClick={handleShowHint}
                          className="text-sm sm:text-base text-[#3b2f13] hover:underline"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        {showHint && (
                          <span className="ml-2 text-sm sm:text-base text-blue-700">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                }
                return null;
              })()}
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 px-4 pb-4">
            <Button
              className={`rounded-md px-6 py-2 font-semibold text-base shadow transition-colors duration-150 ${
                isFirst || isSubmitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-400 hover:bg-gray-500 text-white"
              }`}
              onClick={handlePrev}
              disabled={isFirst || isSubmitting}
            >
              Previous
            </Button>
            {currentIndex >= 24 ? (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 font-semibold text-base shadow"
                onClick={handleCompleteLesson}
                disabled={isSubmitting || !isAnswered(q, sel)}
              >
                Complete Lesson
              </Button>
            ) : isLast ? (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 font-semibold text-base shadow"
                onClick={handleCompleteLesson}
                disabled={isSubmitting || !isAnswered(q, sel)}
              >
                Complete Lesson
              </Button>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/80 text-white rounded-md px-6 py-2 font-semibold text-base shadow"
                onClick={() => {
                  if (isAnswered(q, sel)) handleNext();
                }}
                disabled={isSubmitting || !isAnswered(q, sel)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
      {showLessonComplete && (
        <LessonCompletePanel
          isOpen={showLessonComplete}
          lessonData={{
            ...lessonCompleteData,
            incorrectAnswers: getMistakes(),
            allQuestions: performedQuestions,
            chapters: allChaptersForUnit,
          }}
          lessonTitle={chapter}
          nextLessonTitle="Next Lesson"
          onReviewMistakes={() => {
            setShowLessonComplete(false);
            setShowReviewMistakes(true);
            setReviewMistakeIndex(0);
          }}
          onStartNextLesson={() => {
            onLessonComplete();
            // Reset all quiz state
            setShowLessonComplete(false);
            setProgress(startIndex + 1);
            setCurrentIndex(startIndex);
            setAnswered(false);
            setSelected([]);
            setShowHint(false);
            setShowError(false);
            setValidation("");
          }}
        />
      )}
      {showReviewMistakes && (
        <ReviewMistakesPanel
          isOpen={showReviewMistakes}
          onClose={() => {
            setShowReviewMistakes(false);
            setShowLessonComplete(true);
          }}
          mistakes={getMistakes()}
          currentIndex={reviewMistakeIndex}
          total={getMistakes().length}
          onPrev={() => setReviewMistakeIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setReviewMistakeIndex((i) =>
              Math.min(getMistakes().length - 1, i + 1)
            )
          }
          onReturnSummary={() => {
            setShowReviewMistakes(false);
            setShowLessonComplete(true);
          }}
        />
      )}
      {!isReferencePanelOpen && (
        <button
          className="fixed bottom-8 right-8 bg-[#C1121F] hover:bg-[#a00e1a] text-white p-4 rounded-full shadow-lg z-[103]"
          onClick={() => setIsReferencePanelOpen(true)}
          aria-label="Open Reference Menu"
        >
          <BookOpen size={24} />
        </button>
      )}
    </div>
  );
};

export default WineQuizPanel;
