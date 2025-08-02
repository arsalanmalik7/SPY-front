import React from 'react'
import Button from "./button"
import Badge from "./badge"

export default function RestaurantCard({
  name,
  address,
  status,
  employeeCount,
  menuItemCount,
  trainingCompletion,
  onViewEmployees,
  onManageMenu,
  onLessonProgress,
  onManageRestaurant
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="text-left">
          <h3 className="text-lg font-semibold text-textcolor">{name}</h3>
          <p className="text-sm text-gray-800">{address}</p>
        </div>
        {status === "active" ? (
          <Badge variant='default' className="bg-iconbackground text-gray-900 border-iconbackground">Active</Badge>
        ) : (
          <Badge variant="default" className="bg-gray-50 text-gray-500 border-gray-200">
            Deactivated
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4">
          <div className="flex items-center space-x-2">
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
              className="text-textcolor"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="text-sm text-gray-600">{employeeCount} Employees</span>
          </div>
          <div className="flex items-center space-x-2">
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
              className="text-textcolor"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
              <path d="M7 2v20"></path>
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
            </svg>
            <span className="text-sm text-gray-600">{menuItemCount} Items</span>
          </div>
          {/* <div className="flex items-center space-x-2">
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
              className="text-textcolor"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span className="text-sm text-gray-600">0% Complete</span>
          </div> */}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={onViewEmployees}>
            View Employees
          </Button>
          <Button variant="primary" size="sm" onClick={onManageMenu}>
            Manage Menu
          </Button>
          <Button variant="primary" size="sm" onClick={onLessonProgress}>
            Lesson Progress
          </Button>
          <Button variant="primary" size="sm" onClick={onManageRestaurant}>
            Manage Restaurant
          </Button>
        </div>
      </div>
    </div>
  )
}
