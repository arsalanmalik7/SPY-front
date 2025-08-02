"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { profileService } from "../services/profileService"

export default function EditProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAllRestaurants, setShowAllRestaurants] = useState(false)

  // In a real app, you would fetch this data from your API
  const [formData, setFormData] = useState(JSON.parse(localStorage.getItem('userinfo') || ""))

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image_file: file, // Store the file directly
        image_url: URL.createObjectURL(file), // Create a URL for the uploaded image
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('first_name', formData.first_name)
      formDataToSend.append('last_name', formData.last_name)
      formDataToSend.append('email', formData.email)

      // Append the file directly from the state
      if (formData.image_file) {
        formDataToSend.append('profilePhoto', formData.image_file, formData.image_file.name)
      }

      const userId = formData.id
      const response = await profileService.editProfile(userId, formDataToSend)
      

      // Update local storage with new data
      localStorage.setItem('userinfo', JSON.stringify(response?.user))

      navigate("/profile-page")
    } catch (err) {
      console.error('Error updating profile:', err) // Log the error to the console
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/profile-page")
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6 ">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h1 className="text-xl font-medium text-gray-900">Edit Account Info</h1>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6 text-left">Update your profile details below.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="rounded-lg bg-white shad overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {formData.image_url ? (
                        <img 
                          src={formData.image_url.startsWith('data:') || formData.image_url.startsWith('blob:') ? 
                            formData.image_url : 
                            `${process.env.REACT_APP_IMAGE_BASE_URL}${formData.image_url}`} 
                          alt="Avatar" 
                          className="h-full w-full rounded-full object-cover" 
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex space-x-2 mb-1">
                        <input
                          type="file"
                          accept="image/*"
                          name="image"
                          onChange={handleChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer">
                          Change Avatar
                        </label>
                        <button
                          type="button"
                          className="px-3 py-1.5 border border-primary text-primary text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Supported formats: JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        User Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role === "super_admin" ? "Super Admin" : formData.role}
                        disabled
                        className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm text-center"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between">
                      <label htmlFor="restaurants" className="block text-sm font-medium text-gray-700">
                       Restaurants 
                      </label>
                      <div className="mt-1 bg-gray-50 border border-gray-300 rounded-md py-2 px-3 w-full sm:w-[500px]">
                        {formData?.assigned_restaurants?.length > 0 ? (
                          <>
                            {formData.assigned_restaurants
                              .slice(0, showAllRestaurants ? undefined : 4)
                              .map((restaurant, index) => (
                                <div key={index} className="text-sm text-gray-700 py-1">
                                  {typeof restaurant === 'object' ? restaurant.name : restaurant}
                                </div>
                              ))}
                            {formData.assigned_restaurants.length > 4 && (
                              <button
                                type="button"
                                onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                                className="text-primary hover:text-gray-600 text-sm font-medium mt-2"
                              >
                                {showAllRestaurants ? 'See Less' : `See More (${formData.assigned_restaurants.length - 4} more)`}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 py-1">
                            No assigned restaurants.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-hover p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-primary">Changing your email will require re-verification</span>
                  </div>
                </div> */}

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
