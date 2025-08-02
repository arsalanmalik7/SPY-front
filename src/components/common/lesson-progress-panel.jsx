import ProgressBar from "./progressBar"
import { useEffect, useState } from "react"
import { getLessonProgressByRestaurant } from "../../services/lessonProgress"

export default function LessonProgressPanel({ restaurant, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurant?.uuid) return;
    setLoading(true);
    setError(null);
    getLessonProgressByRestaurant(restaurant.uuid)
      .then((res) => setData(res))
      .catch(() => setError("Failed to fetch lesson progress"))
      .finally(() => setLoading(false));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [restaurant?.uuid]);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-textcolor">Lesson Progress - {restaurant?.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-textcolor"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 space-y-6">
        {loading ? (
          <div className="text-center py-8">Loading lesson progress...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : data ? (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-2.5 bg-background rounded-xl text-left">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Employees</h3>
                <p className="text-2xl font-bold text-textcolor">{data.totalEmployees ?? 0}</p>
                <p className="text-xs text-gray-500">Assigned Training</p>
              </div>
              <div className="p-2.5 bg-background rounded-xl text-left">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Modules Completed</h3>
                <p className="text-2xl font-bold text-textcolor">{data.completedLessons ?? 0}</p>
                <p className="text-xs text-gray-500">Out of {data.totalLessons ?? 0}</p>
              </div>
              <div className="p-2.5 bg-background rounded-xl text-left">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Engagement Rate</h3>
                <p className="text-2xl font-bold text-textcolor">{Math.round(data.lessonsEngagementRateLastThirtyDays) ?? 0}%</p>
                <p className="text-xs text-gray-500">Last 30 Days</p>
              </div>
              <div className="p-2.5 bg-background rounded-xl text-left">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Completion</h3>
                <p className="text-2xl font-bold text-textcolor">{data.avgCompletionRatePerLesson ?? 0}m</p>
                <p className="text-xs text-gray-500">Per Lesson</p>
              </div>
            </div>

            {/* Training Activity */}
            {/* <div>
              <h3 className="text-sm font-medium mb-2 text-left text-textcolor">Training Activity (Last 30 Days)</h3>
              <div className="h-40 bg-background rounded-md flex items-end justify-between p-2">
                {[35, 45, 30, 50, 40, 60, 55, 25, 45, 55, 50, 40].map((height, index) => (
                  <div key={index} className="w-4 bg-textcolor rounded-t" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div> */}

            {/* Completion Rate by Role */}
            <div>
              <h3 className="text-sm font-medium mb-2 text-left text-textcolor">Completion Rate by Role</h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="w-full sm:w-[48%]">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Managers</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <ProgressBar
                    variant="dark"
                    showLabel={false}
                    value={98}
                    max={100}
                    className="h-2 bg-gray-100"
                    progressClassName="bg-primary"
                  />
                </div>
                <div className="w-full sm:w-[48%]">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Employees</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <ProgressBar
                    variant="dark"
                    showLabel={false}
                    value={92}
                    max={100}
                    className="h-2 bg-gray-100"
                    progressClassName="bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Overdue Lessons */}
            <div>
              <h3 className="text-sm font-medium mb-2 text-left text-[#7C1D37]">Overdue Lessons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(data.overDueEmployeesInLessons) && data.overDueEmployeesInLessons.length > 0)
                  ? data.overDueEmployeesInLessons.map((emp, idx) => (
                    <div key={idx} className="bg-[#FFF4D6] rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        <div>
                          <span className="font-bold text-gray-800 block">
                            {emp.first_name} {emp.last_name}
                          </span>
                          <span className="text-xs text-gray-500 block">
                            {emp.module || "Module Name"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[#7C1D37] font-medium ml-2">
                        {emp.days || "0"} days
                      </span>
                    </div>
                  ))
                  : <div className="col-span-2 text-center text-gray-400">No overdue lessons</div>
                }
              </div>
            </div>

            {/* Top Learners */}
            <div>
              <h3 className="text-sm font-medium mb-2 text-left text-[#7C1D37]">Top Learners</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(data.topLessonLearners) && data.topLessonLearners.length > 0)
                  ? data.topLessonLearners.map((learner, idx) => (
                    <div key={idx} className="bg-[#FFF4D6] rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full text-[#7C1D37] flex items-center justify-center text-xs font-bold bg-[#f9fafb]">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block">
                            {learner.first_name} {learner.last_name}
                          </span>
                          <span className="text-xs text-gray-500 block">
                            {learner.completionRate ? `${learner.completionRate}% Completion Rate` : "N/A"}
                          </span>
                        </div>
                      </div>
                      <span className="ml-2">
                        {idx === 0 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7C1D37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7C1D37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        )}
                      </span>
                    </div>
                  ))
                  : <div className="bg-[#FFF4D6] rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full text-[#7C1D37] flex items-center justify-center text-xs font-bold bg-[#f9fafb]">0</div>
                        <div>
                          <span className="font-bold text-gray-800 block">No top learners</span>
                          <span className="text-xs text-gray-500 block">N/A</span>
                        </div>
                      </div>
                    </div>
                }
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}