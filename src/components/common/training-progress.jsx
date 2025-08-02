import ProgressBar from "./progressBar"

export default function TrainingProgress({ progress, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) return null;

  const { food, wine, overAllProgress, allLessons, completedLessons } = progress;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h3 className="text-lg font-semibold">Training Progress</h3>
        {/* <div className="relative mt-3 sm:mt-0">
          <select className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
            <option>All Locations</option>
            <option>Downtown Bistro</option>
            <option>Uptown Grill</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </div> */}
      </div>
      <div className="p-4">
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Food Knowledge</span>
              <span className="text-sm font-medium">{food.foodAverageScoreInPercentage}%</span>
            </div>
            <ProgressBar showLabel={false} variant="dark" value={food.foodAverageScoreInPercentage} max={100} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Wine Knowledge</span>
              <span className="text-sm font-medium">{wine.wineAverageScoreInPercentage}%</span>
            </div>
            <ProgressBar showLabel={false} variant="dark" value={wine.wineAverageScoreInPercentage} max={100} />
          </div>
        </div>

        {/* <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Average Chapter Completion Time (30 Days)</h4>
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300"
            >
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
          </div>
        </div> */}

        <div className="mb-6 mt-5">
          <h4 className="text-sm font-medium mb-2">Training Status</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Completed Lessons</span>
                <span className="text-xs font-medium">{completedLessons}</span>
              </div>
              <ProgressBar showLabel={false} variant="dark" value={completedLessons} max={allLessons} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Remaining Lessons</span>
                <span className="text-xs font-medium">{allLessons - completedLessons}</span>
              </div>
              <ProgressBar showLabel={false} variant="dark" value={allLessons - completedLessons} max={allLessons} />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="mt-5">
              <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Average Score</span>
                    <span className="text-xs font-medium">{progress.averageScore}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Average Attempts</span>
                    <span className="text-xs font-medium">{progress.averageAttempts}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h4 className="text-sm font-medium mb-2">Category Progress</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Food Lessons</span>
                    <span className="text-xs font-medium">{food.foodCompletedLessons} completed</span>
                  </div>
                  <ProgressBar showLabel={false} variant="dark" value={food.foodCompletedLessons} max={allLessons} />
                </div>
                <div className="mt-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Wine Lessons</span>
                    <span className="text-xs font-medium">{wine.wineCompletedLessons} completed</span>
                  </div>
                  <ProgressBar showLabel={false} variant="dark" value={wine.wineCompletedLessons} max={allLessons} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
