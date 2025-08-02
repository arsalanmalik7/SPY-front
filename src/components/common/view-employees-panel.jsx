import { useEffect, useState } from "react";
import { ManageStaffUserService } from "../../services/ManageStaffUsers";

export default function ViewEmployeesPanel({ restaurant, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurant?.uuid) return;
    setLoading(true);
    setError(null);
    ManageStaffUserService.getEmployeesByRestaurant(restaurant.uuid)
      .then((res) => {
        setData(res);
      })
      .catch(() => setError("Failed to fetch employees"))
      .finally(() => setLoading(false));
  }, [restaurant?.uuid]);

  // Mock completion rate by role (since not in API)
  const completionRateByRole = [
    { role: "Managers", rate: 95 },
    { role: "Employees", rate: 82 },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">View Employees - {restaurant?.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">Loading employees...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : data ? (
          <div className="space-y-6">
            {/* Total Employees */}
            <div className="bg-[#FFF4D6] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Total Employees</div>
                <div className="text-3xl font-bold text-gray-700">{data.totalEmployees}</div>
              </div>
              <div className="p-3 rounded-full bg-[#f9fafb]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#7C1D37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Active vs Inactive */}
            <div>
              <div className="font-semibold text-center mb-2">Active vs. Inactive (Last 7 Days)</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFF4D6] rounded-xl p-4 flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-700">{data.activeEmployees}</div>
                  <div className="text-sm text-gray-600">Active</div>
                  <div className="mt-2 text-[#7C1D37]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="bg-[#FFF4D6] rounded-xl p-4 flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-700">{data.inactiveEmployees}</div>
                  <div className="text-sm text-gray-600">Inactive</div>
                  <div className="mt-2 text-[#7C1D37]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12l-2-2-4 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Progress */}
            <div>
              <div className="font-semibold text-center mb-2">Training Progress</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#FFF4D6] rounded-xl p-4 flex flex-col items-center">
                  <div className="text-xl font-bold text-gray-700">{data.completedTrainingByEmployees}</div>
                  <div className="text-sm text-gray-600">Completed Training</div>
                </div>
                <div className="bg-[#FFF4D6] rounded-xl p-4 flex flex-col items-center">
                  <div className="text-xl font-bold text-gray-700">{data.inProgresTrainingByEmployees}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-[#FFF4D6] rounded-xl p-4 flex flex-col items-center">
                  <div className="text-xl font-bold text-gray-700">{data.notStartedTrainingByEmployees}</div>
                  <div className="text-sm text-gray-600">Not Started</div>
                </div>
              </div>
            </div>

            {/* Most Active Employees (Last 30 Days) */}
            <div>
              <div className="font-semibold text-center mb-2">Most Active Employees (Last 30 Days)</div>
              <div className="grid grid-cols-3 gap-4">
                {Array.isArray(data.mostActiveEmployeesInLastThirtyDays) && data.mostActiveEmployeesInLastThirtyDays.length > 0 ? (
                  data.mostActiveEmployeesInLastThirtyDays.map((emp, idx) => (
                    <div key={idx} className="bg-[#FFF4D6] rounded-xl p-4 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 mb-2"></div>
                      <div className="font-medium text-gray-700">{emp.name}</div>
                      <div className="text-xs text-gray-600">{emp.lessons} lessons</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-400">No data</div>
                )}
              </div>
            </div>

            {/* Overdue Training */}
            <div>
              <div className="font-semibold text-center mb-2">Overdue Training</div>
              <div className="flex flex-wrap gap-4">
                {Array.isArray(data.lessonOverDueEmployees) && data.lessonOverDueEmployees.filter(emp => emp.name && emp.daysOverdue).length > 0 ? (
                  data.lessonOverDueEmployees
                    .filter(emp => emp.name && emp.daysOverdue)
                    .map((emp, idx) => (
                      <div key={idx} className="bg-[#FFF4D6] rounded-xl px-6 py-3 flex items-center justify-between w-full sm:w-[270px] md:w-[260px] lg:w-[250px]">
                        <span className="text-[#7C1D37] mr-2">&#10060;</span>
                        <span className="font-bold text-gray-800 flex-1 text-center">{emp.name}</span>
                        <span className="text-[#7C1D37] font-medium ml-2">{emp.daysOverdue} days</span>
                      </div>
                    ))
                ) : (
                  <div className="col-span-2 text-center text-gray-400">No overdue training</div>
                )}
              </div>
            </div>

            {/* Completion Rate by Role */}
            {/* (Section removed as per user request) */}
          </div>
        ) : null}
      </div>
    </div>
  );
}