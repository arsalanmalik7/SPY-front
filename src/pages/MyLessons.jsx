import React, { useState, useEffect } from "react";
import Tabs from "../components/common/tabs";
import Card from "../components/common/card";
import Badge from "../components/common/badge";
import Button from "../components/common/button";
import { CheckCircle, Lock, ArrowRight, Building2 } from "lucide-react";
import WineQuizPanel from "../components/common/WineQuizPanel";
import FoodQuizPanel from "../components/common/FoodQuizPanel";
import { getEmployeeLessons, getRestaurants } from "../services/lessonProgress";
import authService from "../services/authService";
import RestaurantSelectModal from "../components/common/RestaurantSelectModal";
import { useNavigate } from "react-router-dom";

const ChapterStatus = ({ status, unitLocked, onStart }) => {
  if (status === "completed" && unitLocked === false)
    return (
      <Badge
        variant="success"
        className="flex items-center gap-1 bg-yellow-200 text-black px-2 py-2 text-sm font-medium"
      >
        <CheckCircle size={16} className="text-black" />{" "}
        <span className="text-black"> Completed </span>
      </Badge>
    );
  if (status === "start" && unitLocked === false)
    return (
      <Button
        size="sm"
        className="flex items-center gap-1  text-white rounded px-3 py-1 text-sm font-semibold hover:bg-primary/80"
        variant="primary"
        onClick={onStart}
      >
        <ArrowRight size={16} className="text-white" /> Start
      </Button>
    );
  if (status === "locked" && unitLocked === false)
    return (
      <Badge
        variant="default"
        className="flex items-center gap-1 bg-yellow-200 text-gray-600 px-2 py-0.5 text-sm font-medium"
      >
        <Lock size={16} className="text-gray-600" /> Locked
      </Badge>
    );
  return null;
};

const UnitCard = ({ unit, desc, chapters, locked, type, onStartQuiz }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  return (
    <div className="relative">
      <Card
        className={`mb-4 w-full ${
          locked ? "bg-[#f8f3e7] opacity-80" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-left">
            <div className="text-base sm:text-lg text-black leading-tight">
              {unit}
            </div>
            {/* <div className="text-sm sm:text-base text-black mt-0.5 leading-tight">{desc}</div> */}
          </div>
          {locked && (
            <span className="ml-2">
              <Lock size={18} className="text-gray-500" />
            </span>
          )}
        </div>
        <div className="space-y-2 mt-2">
          {chapters.map((ch, idx) => {
            return (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-lg px-2 py-2 sm:px-3 sm:py-2 mb-1 ${
                  ch.status === "completed"
                    ? "bg-[#ffb84d] text-[#3b2f13]"
                    : ch.status === "start" && !locked
                    ? "bg-white text-[#3b2f13]"
                    : "bg-[#f8f3e7] text-gray-500"
                }`}
              >
                <div
                  className={`flex flex-col text-sm sm:text-base text-left ${
                    ch.status === "locked" ? "text-gray-500" : ""
                  }`}
                >
                  <span
                    className={`font-medium text-left ${
                      ch.status === "locked" ? "text-gray-500" : ""
                    }`}
                  >
                    Chapter {ch.chapter}
                  </span>
                  <span
                    className={`ml-0 mt-0.5 text-xs sm:text-sm font-normal text-left ${
                      ch.status === "locked" ? "text-gray-500" : ""
                    }`}
                  >
                    {ch.title}
                  </span>
                </div>
                <div>
                  <span className="p-2">
                    {ch.questions && Array.isArray(ch.questions)
                      ? ` ${ch?.attemptedQuestions?.length}/${ch.questions.length}`
                      : ""}
                  </span>
                  <ChapterStatus
                    status={ch.status}
                    unitLocked={locked}
                    onStart={
                      ch.status === "start"
                        ? () => onStartQuiz(type, unit, ch.title)
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Layover for locked units */}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10 rounded-lg">
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                You are on Free Trial
              </div>
              {userRole !== "employee" ? (
                <>
                  <div className="text-sm text-gray-600 mb-3">
                    Upgrade your plan to unlock this unit and access all
                    lessons.
                  </div>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    onClick={() => {
                      navigate("/subscription");
                    }}
                  >
                    Upgrade Now
                  </Button>
                </>
              ) : (
                <div className="text-sm text-gray-600 mb-3">
                  Contact your admin to unlock this unit and access all lessons.
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="text-lg sm:text-xl font-semibold text-[#3b2f13] mb-2 sm:mb-3 mt-6 sm:mt-8 text-left w-full">
    {children}
  </div>
);

// Group lessons by unit and unit_name
function groupLessonsByUnit(lessons, category) {
  const units = {};
  lessons
    ?.filter((lesson) => lesson.category.toLowerCase() === category)
    .forEach((lesson) => {
      const key = `${lesson.unit}-${lesson.unit_name}`;
      if (!units[key]) {
        units[key] = {
          unit: lesson.unit,
          unit_name: lesson.unit_name,
          category: lesson.category,
          attemptedQuestions: lesson.attemptedQuestions,
          chapters: [],
        };
      }
      units[key].chapters.push({
        chapter: lesson.chapter,
        attemptedQuestions: lesson.attemptedQuestions,
        chapter_name: lesson.chapter_name,
        status: lesson.status.toLowerCase(),
        uuid: lesson.uuid,
        questions: lesson.questions,
        lessonObj: lesson, // keep the full lesson for quiz
      });
    });
  // Sort chapters by chapter number
  Object.values(units).forEach((unit) => {
    unit.chapters.sort((a, b) => a.chapter - b.chapter);
  });
  return Object.values(units).sort((a, b) => a.unit - b.unit);
}

export const MyLessons = () => {
  // const [tab, setTab] = useState('all');
  const [quizPanel, setQuizPanel] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [lessons, setLessons] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState({});
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser.role) {
        setUserRole(currentUser?.role);
      }
      if (currentUser?.role !== "employee") {
        try {
          const data = await getRestaurants();

          // Ensure data is an array
          const restaurantsArray = Array.isArray(data) ? data : [];
          setRestaurants(restaurantsArray);

          if (restaurantsArray.length > 0 && currentUser?.role !== "employee") {
            setSelectedRestaurant(restaurantsArray[0].uuid);
          }
        } catch (error) {
          console.error("Error fetching restaurants:", error);
          setRestaurants([]);
        }
      } else {
        setSelectedRestaurant("employee");
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.log(error, "error");
      }
    };

    fetchProfile();

    fetchRestaurants();
  }, [userRole]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedRestaurant) {
        try {
          const data = await getEmployeeLessons(selectedRestaurant);
          setLessons(data);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      }
    };

    fetchLessons();
  }, [selectedRestaurant]);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Food", value: "food" },
    { label: "Wine", value: "wine" },
  ];

  const filteredFoodLessons = lessons.filter(
    (lesson) => lesson.category === "food"
  );
  const filteredWineLessons = lessons.filter(
    (lesson) => lesson.category === "wine"
  );

  const processedFoodLessons = filteredFoodLessons?.map((lesson, idx) => {
    let anyFoodFailed = false;
    let status = lesson.status;
    if (idx === 0) {
      if (status !== "Completed") status = "start";
    } else {
      if (
        filteredFoodLessons[idx - 1].status !== "Completed" ||
        anyFoodFailed
      ) {
        status = "locked";
      } else if (status === "Completed") {
        status = "completed";
      } else {
        status = "start";
      }
    }
    if (status !== "Completed") anyFoodFailed = true;
    return { ...lesson, status };
  });

  const processedWineLessons = filteredWineLessons?.map((lesson, idx) => {
    let anyWineFailed = false;
    let status = lesson.status;
    if (idx === 0) {
      if (status !== "Completed") status = "start";
    } else {
      if (
        filteredWineLessons[idx - 1].status !== "Completed" ||
        anyWineFailed
      ) {
        status = "locked";
      } else if (status === "Completed") {
        status = "completed";
      } else {
        status = "start";
      }
    }
    if (status !== "Completed") anyWineFailed = true;

    return { ...lesson, status };
  });

  const groupedFoodUnits = groupLessonsByUnit(processedFoodLessons, "food");
  const groupedWineUnits = groupLessonsByUnit(processedWineLessons, "wine");

  const groupFoodLessons = [groupedFoodUnits];
  const groupWineLessons = [groupedWineUnits];

  // Tabs content for each tab
  const getTabContent = (type) => {
    if (!lessons || lessons.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">
            There are no lessons available for this restaurant.
          </p>
        </div>
      );
    }

    return (
      <>
        {(type === "all" || type === "food") &&
          groupFoodLessons[0].length !== 0 && (
            <>
              <SectionTitle>Food Units</SectionTitle>
              {groupFoodLessons.map((menu, i) => {
                return (
                  <Card key={i} className="mb-6">
                    {groupedFoodUnits.map((unit) => (
                      <UnitCard
                        key={unit.unit + unit.unit_name}
                        unit={`Unit ${unit.unit}: ${unit.unit_name}`}
                        desc={unit.chapters
                          .map(
                            (ch) => `Chapter ${ch.chapter}: ${ch.chapter_name}`
                          )
                          .join(", ")}
                        type="food"
                        locked={
                          user?.current_subscription?.plan === "Free trial" &&
                          user?.role !== "super_admin" &&
                          unit?.unit === 2
                            ? true
                            : false
                        }
                        chapters={unit.chapters.map((ch) => ({
                          title: ch.chapter_name,
                          chapter: ch.chapter,
                          status: ch.status,
                          uuid: ch.uuid,
                          attemptedQuestions: ch.attemptedQuestions,
                          questions: ch.questions,
                          lessonObj: ch.lessonObj,
                        }))}
                        onStartQuiz={handleStartQuiz}
                      />
                    ))}
                  </Card>
                );
              })}
            </>
          )}
        {(type === "all" || type === "wine") &&
          groupWineLessons[0].length > 0 && (
            <>
              <SectionTitle>Wine Units</SectionTitle>
              {groupWineLessons.map((menu, i) => {
                return (
                  <Card key={i} className="mb-6">
                    {groupedWineUnits.map((unit) => (
                      <UnitCard
                        key={unit.unit + unit.unit_name}
                        unit={`Unit ${unit.unit}: ${unit.unit_name}`}
                        desc={unit.chapters
                          .map(
                            (ch) => `Chapter ${ch.chapter}: ${ch.chapter_name}`
                          )
                          .join(", ")}
                        type="wine"
                        locked={
                          user?.current_subscription?.plan === "Free trial" &&
                          user?.role !== "super_admin" &&
                          unit?.unit === 2
                            ? true
                            : false
                        }
                        chapters={unit.chapters.map((ch) => ({
                          title: ch.chapter_name,
                          chapter: ch.chapter,
                          status: ch.status,
                          uuid: ch.uuid,
                          attemptedQuestions: ch.attemptedQuestions,
                          questions: ch.questions,
                          lessonObj: ch.lessonObj,
                        }))}
                        onStartQuiz={handleStartQuiz}
                      />
                    ))}
                  </Card>
                );
              })}
            </>
          )}
      </>
    );
  };

  function handleStartQuiz(type, unit, chapter) {
    let foundLesson = null;
    for (const l of lessons) {
      if (
        l.category === type &&
        `Unit ${l.unit}: ${l.unit_name}` === unit &&
        l.chapter_name === chapter
      ) {
        foundLesson = l;
        break;
      }
    }

    if (foundLesson) {
      // attemptedQuestions is an array of objects, each with a questionId or uuid
      const attemptedIds = (foundLesson.attemptedQuestions || []).map(
        (aq) => aq.uuid
      );
      // Filter out questions whose uuid is in attemptedIds
      const unattemptedQuestions = foundLesson.questions.filter(
        (q) => !attemptedIds.includes(q.uuid)
      );

      const processedQuestions = unattemptedQuestions.map((q) => ({
        id: q.uuid,
        question: q.question_text,
        type: q.question_type,
        options: q.options_variable,
        correct: q.correct_answer_variable,
        difficulty:
          q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
        hint: q.hint,
        error: "Incorrect. Try again.",
      }));
      if (type === "food") {
        setQuizPanel({
          type: "food",
          unit: `Unit ${foundLesson.unit}: ${foundLesson.unit_name}`,
          chapter: foundLesson.chapter_name,
          questions: processedQuestions,
          content: foundLesson.content,
          difficulty: foundLesson.difficulty,
          lessonId: foundLesson.id,
          lessonUuid: foundLesson.uuid,
          startIndex: 0,
          attemptedQuestions: foundLesson.attemptedQuestions,
        });
      } else if (type === "wine") {
        setQuizPanel({
          type: "wine",
          unit: `Unit ${foundLesson.unit}: ${foundLesson.unit_name}`,
          chapter: foundLesson.chapter_name,
          questions: processedQuestions,
          content: foundLesson.content,
          difficulty: foundLesson.difficulty,
          lessonId: foundLesson.id,
          lessonUuid: foundLesson.uuid,
          startIndex: 0,
          attemptedQuestions: foundLesson.attemptedQuestions,
        });
      }
    }
  }

  function handleCloseQuiz() {
    setQuizPanel(null);
  }

  const getSelectedRestaurantName = () => {
    if (userRole === "employee") return "Employee View";
    const restaurant = restaurants.find((r) => r.uuid === selectedRestaurant);
    return restaurant ? restaurant.name : "Select Restaurant";
  };

  return (
    <div className="max-w-7xl w-full mx-auto py-4 px-2 sm:px-4 md:px-8 min-h-screen">
      {userRole !== "employee" &&
        Array.isArray(restaurants) &&
        restaurants.length > 0 && (
          <div className="mb-6">
            <Button
              variant="secondary"
              onClick={() => setIsRestaurantModalOpen(true)}
              className="w-full max-w-xs flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {getSelectedRestaurantName()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Select a restaurant
                  </div>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        )}
      <RestaurantSelectModal
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        onSelect={setSelectedRestaurant}
      />
      <Tabs
        tabs={tabs.map((t) => ({
          label: t.label,
          content: getTabContent(t.value),
        }))}
        defaultTab={0}
        className="mb-4 sm:mb-6"
        // onTabChange={(_, idx) => setTab(tabs[idx].value)}
      />
      {quizPanel && quizPanel.type === "food" && (
        <FoodQuizPanel
          isOpen={true}
          onClose={handleCloseQuiz}
          unit={quizPanel.unit}
          chapter={quizPanel.chapter}
          questions={quizPanel.questions}
          content={quizPanel.content}
          difficulty={quizPanel.difficulty}
          lessonId={quizPanel.lessonId}
          lessonUuid={quizPanel.lessonUuid}
          startIndex={quizPanel.startIndex}
          onLessonComplete={async () => {
            setQuizPanel(null);
            // Re-fetch lessons for the current restaurant
            if (selectedRestaurant) {
              const data = await getEmployeeLessons(selectedRestaurant);
              setLessons(data);
            }
          }}
          allChaptersForUnit={lessons.filter(
            (l) =>
              l.category === "food" &&
              `Unit ${l.unit}: ${l.unit_name}` === quizPanel.unit
          )}
          menuData={lessons.find((l) => l.uuid === quizPanel.lessonUuid)?.menu}
          attemptedQuestions={quizPanel.attemptedQuestions}
        />
      )}
      {quizPanel && quizPanel.type === "wine" && (
        <WineQuizPanel
          isOpen={true}
          onClose={handleCloseQuiz}
          unit={quizPanel.unit}
          chapter={quizPanel.chapter}
          questions={quizPanel.questions}
          content={quizPanel.content}
          difficulty={quizPanel.difficulty}
          lessonId={quizPanel.lessonId}
          lessonUuid={quizPanel.lessonUuid}
          startIndex={quizPanel.startIndex}
          onLessonComplete={async () => {
            setQuizPanel(null);
            // Re-fetch lessons for the current restaurant
            if (selectedRestaurant) {
              const data = await getEmployeeLessons(selectedRestaurant);
              setLessons(data);
            }
          }}
          allChaptersForUnit={lessons.filter(
            (l) =>
              l.category === "wine" &&
              `Unit ${l.unit}: ${l.unit_name}` === quizPanel.unit
          )}
          menuData={lessons.find((l) => l.uuid === quizPanel.lessonUuid)?.menu}
          attemptedQuestions={quizPanel.attemptedQuestions}
        />
      )}
    </div>
  );
};

export default MyLessons;
