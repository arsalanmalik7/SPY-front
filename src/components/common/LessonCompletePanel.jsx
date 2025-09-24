import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "./card";
import ProgressBar from "./progressBar";
import Button from "./button";

const LessonCompletePanel = ({
  lessonData = {
    accuracy: 0,
    attempts: 0,
    incorrectAnswers: [],
    allQuestions: 0,
    completedChapters: 0,
    allChapters: 0,
    progress: {
      status: "not_started",
      score: 0,
      attempts: [],
    },
  },
  lessonTitle = "Lesson",
  nextLessonTitle = "Next Lesson",
  onReviewMistakes = () => {},
  onStartNextLesson = () => {},
  onReturnToMyLessons = () => {},
  isOpen,
}) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();

  const handleStartNextLesson = () => {
    setSelectedButton("next");
    onStartNextLesson();
    navigate("/my-lessons");
  };

  console.log("Lesson Data:", lessonData);

  // Calculate chapters progress from chapters array if available
  let completedChapters = lessonData.completedChapters;
  let allChapters = lessonData.allChapters;
  if (Array.isArray(lessonData.chapters)) {
    allChapters = lessonData.chapters.length;
    completedChapters = lessonData.chapters.filter(
      (ch) => ch.status && ch.status.toLowerCase() === "completed"
    ).length;
    completedChapters += 1;
  }

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "" : "hidden"}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      {/* Fullscreen/Sliding Panel */}
      <div
        className={`fixed inset-0 w-full h-full bg-[#fcf7ec] shadow-2xl z-[101] overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        {lessonData?.progress?.score >= 70 ? (
          <div className="flex flex-col items-center text-center px-4 py-6 sm:px-8 sm:py-8 mb-6 sm:mb-8">
            <div className="bg-red-600 rounded-full p-3 mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">
              Lesson Complete! 🎉
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {lessonTitle} is now completed!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-4 py-6 sm:px-8 sm:py-8 mb-6 sm:mb-8">
            <div className="bg-yellow-500 rounded-full p-3 mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">
              Lesson Incomplete
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Nice progress in {lessonTitle}! Keep going and continue learning
              to complete this lesson.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8 px-4 sm:px-8">
          <Card className="p-4 text-center sm:text-left bg-white rounded-lg border border-gray-600">
            <div className="text-2xl sm:text-3xl font-semibold text-black mb-1">
              {lessonData.accuracy.toFixed(2)}%
            </div>
            <div className="text-sm sm:text-base text-gray-600">Accuracy</div>
          </Card>
          <Card className="p-4 text-center sm:text-left bg-white rounded-lg border border-gray-600">
            <div className="text-2xl sm:text-3xl font-semibold text-black mb-1">
              {lessonData.attempts}
            </div>
            <div className="text-sm sm:text-base text-gray-600">Attempts</div>
          </Card>
          <Card className="p-4 text-center sm:text-left bg-white rounded-lg border border-gray-600">
            <div className="text-2xl sm:text-3xl font-semibold text-black mb-1">
              {lessonData.incorrectAnswers.length}/
              {lessonData.allQuestions.length}
            </div>
            <div className="text-sm sm:text-base text-gray-600">
              Incorrect Answers
            </div>
          </Card>
          <Card className="p-4 text-center sm:text-left bg-white rounded-lg border border-gray-600">
            <div className="text-2xl sm:text-3xl font-semibold text-black mb-1">
              {lessonData.progress.score}
            </div>
            <div className="text-sm sm:text-base text-gray-600">Score</div>
          </Card>
        </div>

        {/* Unit Progress */}
        <div className="mb-6 sm:mb-8 p-4 bg-white rounded-lg border border-gray-600 mx-4 sm:mx-8">
          <div className="text-base text-left sm:text-lg font-semibold text-black mb-2">
            Unit Progress
          </div>
          <div className="text-base text-left text-gray-600 mb-1">
            {lessonData?.progress?.score >= 70 ? completedChapters : 0} of{" "}
            {allChapters} chapters completed
          </div>
          <ProgressBar
            value={lessonData?.progress?.score >= 70 ? completedChapters : 0}
            max={allChapters}
            showLabel={false}
            variant="primary"
          />
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden sm:grid grid-cols-2 gap-4 px-4 sm:px-8">
          {/* Review Mistakes Card */}
          {lessonData.incorrectAnswers.length > 0 && (
            <Card className="p-4 flex flex-col justify-between border border-gray-600 rounded-lg">
              <div>
                <div className="text-lg text-left font-semibold text-black mb-1">
                  Review Mistakes
                </div>
                <div className="text-base text-left text-gray-600 mb-4">
                  Review the questions you got wrong to improve your knowledge.
                </div>
              </div>
              <Button
                className={`w-full border-2 border-red-600 ${
                  selectedButton === "review"
                    ? "bg-red-600 text-white"
                    : "text-red-600"
                }`}
                onClick={() => {
                  setSelectedButton("review");
                  onReviewMistakes();
                }}
              >
                Review Mistakes
              </Button>
            </Card>
          )}
          {/* Next Lesson Card */}
          <Card
            className={`p-4 flex flex-col justify-between border border-gray-600 rounded-lg ${
              lessonData.incorrectAnswers.length === 0 ? "col-span-2" : ""
            }`}
          >
            <div>
              <div className="text-lg text-left font-semibold text-black mb-1">
                Return to Lessons
              </div>
              <div className="text-base text-left text-gray-600 mb-4">
                Ready to learn about pairing wines with different dishes?
              </div>
            </div>
            <Button
              className={`w-full border-2 border-red-600 ${
                selectedButton === "next"
                  ? "bg-red-600 text-white"
                  : "text-red-600"
              }`}
              onClick={handleStartNextLesson}
            >
              Back To Lesson
            </Button>
          </Card>
        </div>

        {/* Action Buttons - Mobile */}
        <div className="flex flex-col space-y-4 sm:hidden px-4 sm:px-8">
          {/* Review Mistakes */}
          {lessonData.incorrectAnswers.length > 0 && (
            <Card className="p-4 flex flex-col justify-between border border-gray-300 rounded-lg">
              <div>
                <div className="text-base font-semibold text-black mb-1">
                  Review Mistakes
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Review the questions you got wrong to improve your knowledge.
                </div>
              </div>
              <Button
                className={`w-full border-2 border-red-600 ${
                  selectedButton === "review"
                    ? "bg-red-600 text-white"
                    : "text-red-600"
                }`}
                onClick={() => {
                  setSelectedButton("review");
                  onReviewMistakes();
                }}
              >
                Review Mistakes
              </Button>
            </Card>
          )}
          {/* Next Lesson */}
          <Card className="p-4 flex flex-col justify-between border border-gray-300 rounded-lg">
            <div>
              <div className="text-base font-semibold text-black mb-1">
                Next Lesson: {nextLessonTitle}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Ready to learn about pairing wines with different dishes?
              </div>
            </div>
            <Button
              className={`w-full border-2 border-red-600 ${
                selectedButton === "next"
                  ? "bg-red-600 text-white"
                  : "text-red-600"
              }`}
              onClick={handleStartNextLesson}
            >
              Next Lesson: {nextLessonTitle}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonCompletePanel;
