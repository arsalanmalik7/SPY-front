import { useState } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"
import { Alert, Snackbar } from '@mui/material'
import { Eye, EyeOff, } from "lucide-react";

export default function SecurityPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(() => {
    const userInfo = localStorage.getItem("userinfo");
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : {};
    return {
      currentEmail: parsedUserInfo.email || "", // Get current email from local storage
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  })

  const [activeTab, setActiveTab] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidationError, setPasswordValidationError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.changeEmail(formData.newEmail, formData.currentPassword)

      // Update local storage with the new email
      const userInfo = localStorage.getItem("userinfo")
      const parsedUserInfo = userInfo ? JSON.parse(userInfo) : {}
      parsedUserInfo.email = formData.newEmail // Update the email
      localStorage.setItem("userinfo", JSON.stringify(parsedUserInfo)) // Save back to local storage

      setSnackbarMessage("Email updated successfully")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      navigate("/profile-page")
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to update email")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbarMessage("New passwords do not match")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      return
    }

    if (!validatePassword(formData.newPassword)) {
      setPasswordValidationError("Password must be at least 8 characters and include a mix of letters, numbers, and special characters.");
      return;
    } else {
      setPasswordValidationError("");
    }

    setIsLoading(true)
    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword)
      setSnackbarMessage("Password updated successfully")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      navigate("/profile-page")
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to update password")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/profile-page")
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1  p-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-left">
                <h1 className="text-xl font-medium text-gray-900">Manage Email & Password</h1>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6 text-left">Update your email address or change your password.</p>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px flex-wrap">
                  <button
                    onClick={() => setActiveTab("email")}
                    className={`py-4 px-6 text-sm font-medium w-full sm:w-auto text-center sm:text-left ${activeTab === "email"
                      ? "border-b-2 border-gray-800 text-gray-800"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    Email Address
                  </button>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`py-4 px-6 text-sm font-medium w-full sm:w-auto text-center sm:text-left ${activeTab === "password"
                      ? "border-b-2 border-gray-800 text-gray-800"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    Password
                  </button>
                </nav>
              </div>

              {activeTab === "email" && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col sm:flex-row justify-between items-center">
                        <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700">
                          Current Email
                        </label>
                        <input
                          type="email"
                          name="currentEmail"
                          id="currentEmail"
                          value={formData.currentEmail}
                          disabled
                          className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center">
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
                          New Email
                        </label>
                        <input
                          type="email"
                          name="newEmail"
                          id="newEmail"
                          value={formData.newEmail}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center relative">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full sm:w-[500px] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-3  flex items-center z-10"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
                        </button>
                      </div>
                    </div>

                    {/* <div className="mt-6 bg-hover border border-gray-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-primary">
                            You will need to verify your new email address. We'll send a verification link to the new
                            email.
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Email"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="relative">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 text-left">
                          Current Password
                        </label>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(prev => !prev)}
                          className="absolute inset-y-0 right-3 top-5 flex items-center z-10"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-left">
                          New Password
                        </label>
                        <input
                           type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        <button
                          type="button"
                        onClick={() => setShowNewPassword(prev => !prev)}
                          className="absolute inset-y-0 right-3 top-5 flex items-center z-10"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left">
                          Confirm New Password
                        </label>
                        <input
                         type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                           <button
                          type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
                          className="absolute inset-y-0 right-3 top-5 flex items-center z-10"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
                        </button>
                      </div>
                    </div>

                    {passwordValidationError && <div className="mt-6 bg-hover border border-blue-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-primary">
                            Password must be at least 8 characters and include a mix of letters, numbers, and special
                            characters.
                          </p>
                        </div>
                      </div>
                    </div>}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Snackbar for alerts */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}
