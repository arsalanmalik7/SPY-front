import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/common/input';
import Button from '../components/common/button';
import { Eye, EyeOff, Mail, Lock, User, Utensils } from "lucide-react";
import { Alert, Snackbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import authService from '../services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    current_subscription:{
      sub_employee: false
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const resp = await authService.register(formData);

        // Show welcome message for director/manager
        // if (formData.role === "director" || formData.role === "manager") {
        //   setWelcomeMessage("Welcome to SYM! Start by adding your restaurant to get things rolling.");
        //   setShowWelcome(true);
        //   setIsLoading(false);
        //   return; // Stop here, wait for user to close welcome message
        // }
        // For other roles, redirect to login
        if (resp) {
          setIsLoading(false);
          navigate("/login", {
            state: { successMessage: 'Registration successful! Please login.' }
          });

        }
      } catch (error) {
        setErrorMessage(error.message || 'Registration failed. Please try again.');
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg md:bg-white lg:bg-white p-6 sm:p-8 lg:p-10 md:shadow-2xl">

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full ">
            <svg width="128" height="130" viewBox="0 0 128 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_15_3)">
                <path d="M14.096 125.024C14.384 125.024 14.672 124.928 14.96 124.832C19.088 122.72 30.704 117.056 34.736 117.056C35.024 117.056 35.12 117.056 35.216 117.056C43.952 121.76 53.84 124.256 63.824 124.256C97.136 124.256 124.208 97.184 124.208 63.968C124.208 30.752 97.136 3.67999 63.824 3.67999C30.512 3.67999 3.43999 30.752 3.43999 63.968C3.43999 78.176 8.43199 91.904 17.552 102.752C18.128 104.768 15.344 114.464 12.272 122.432C11.984 123.2 12.176 124.064 12.752 124.544C13.232 124.832 13.616 125.024 14.096 125.024ZM63.824 7.51999C95.024 7.51999 120.368 32.864 120.368 63.968C120.368 95.072 95.024 120.416 63.824 120.416C54.512 120.416 45.2 118.112 37.04 113.696C36.464 113.408 35.696 113.216 34.832 113.216C30.8 113.216 22.736 116.768 17.648 119.264C21.296 108.704 22.352 102.464 20.72 100.448C12.08 90.272 7.376 77.312 7.376 64.064C7.28 32.864 32.624 7.51999 63.824 7.51999Z" fill="black" />
                <path d="M89.2438 95.7058C88.5518 100.852 92.0933 100.677 92.0933 100.677C92.0933 100.677 95.425 101.093 94.8892 95.6968C94.6364 93.1378 93.1211 72.4595 93.3105 63.6892C93.4992 54.9204 94.0614 30.5247 94.0614 29.7942C94.0614 28.1974 92.5038 27.559 91.0715 29.7723C91.0715 29.7723 87.5701 34.0496 87.5701 53.3085C87.5701 59.9583 90.8414 57.4665 90.8414 63.7978C90.8421 63.7986 90.4376 86.8306 89.2438 95.7058Z" fill="black" />
                <path d="M34.6177 57.4084C35.6674 45.1962 41.3226 55.6433 37.2981 28.7815C37.2242 28.2759 36.9125 27.9982 36.8393 28.7815C36.7684 29.5339 36.8144 43.9405 36.7661 44.5804C36.7163 45.2196 35.6825 45.3683 35.6327 44.5804C35.5836 43.7918 34.7528 30.1647 34.6592 28.7974C34.6139 28.1416 34.2321 28.0955 34.1913 28.7974C34.1468 29.5844 33.6993 43.9277 33.6503 44.5684C33.6261 44.8876 33.3642 45.1034 33.0964 45.1343C32.8285 45.1034 32.5674 44.8876 32.5417 44.5684C32.4926 43.9277 32.0467 29.5844 32.0014 28.7974C31.9599 28.0955 31.5788 28.1416 31.5343 28.7974C31.4399 30.1647 30.6091 43.7918 30.56 44.5804C30.5102 45.3683 29.4764 45.2196 29.4273 44.5804C29.3783 43.9398 29.4243 29.5331 29.3534 28.7815C29.2794 27.9982 28.97 28.2759 28.8938 28.7815C24.8701 55.6433 30.5246 45.1962 31.5743 57.4084C32.6247 69.6213 30.2401 84.0528 30.0763 91.9448C29.9073 100.04 31.2581 100.48 33.0964 100.48C34.9346 100.48 36.2854 100.04 36.1171 91.9448C35.9519 84.0521 33.5672 69.6213 34.6177 57.4084Z" fill="black" />
                <path d="M74.7157 28.3785L74.4002 27.725H50.8022L50.4755 28.3785C47.6222 34.4895 45.5364 40.9288 44.2634 47.5514C44.0943 48.5037 44.0083 49.4682 44.0068 50.4356C44.0045 53.4669 44.9516 56.4236 46.7159 58.889C49.1443 62.392 52.6586 64.8558 55.5081 66.9107C56.7313 67.7687 57.901 68.7007 59.0111 69.7013C59.3763 70.0469 59.6948 70.4393 59.9566 70.8687C60.1045 71.1049 60.1928 71.3736 60.2132 71.6513V92.6684C60.1068 93.9543 59.6095 95.1761 58.7892 96.1714C57.972 97.1766 56.8189 97.8528 55.5428 98.0746L50.7207 98.8806L50.44 98.9387C50.3676 98.953 50.2966 98.9764 50.2302 99.0088C50.1381 99.042 50.0514 99.0896 49.9729 99.1492C49.8687 99.2179 49.7782 99.3047 49.705 99.4058C49.5593 99.6065 49.4816 99.8472 49.4831 100.095C49.4854 100.281 49.5292 100.465 49.6114 100.632C49.7095 100.824 49.8589 100.986 50.0431 101.099C50.1563 101.166 50.2785 101.217 50.4053 101.251C50.4747 101.259 50.5456 101.259 50.6151 101.251H75.4862L75.7661 101.169C75.8891 101.106 76.0023 101.027 76.1049 100.935C76.2 100.844 76.2793 100.738 76.3381 100.62C76.4234 100.454 76.4679 100.27 76.4672 100.083C76.4679 99.8359 76.3902 99.5944 76.2453 99.3945C76.1382 99.2473 75.9978 99.1273 75.8363 99.0443C75.7608 98.9983 75.6778 98.9666 75.591 98.9507C75.4771 98.9138 75.3594 98.8866 75.2409 98.8685L70.4067 98.0633C68.9895 97.8014 67.6742 97.1464 66.6117 96.1714C65.5733 95.2953 64.947 94.026 64.8836 92.6684V71.3592C64.9228 70.9578 65.0858 70.5782 65.3507 70.2733C66.3846 69.1202 67.5618 68.1037 68.8537 67.2495C71.6881 65.3629 74.3286 63.2002 76.7351 60.7921C79.5159 57.9955 81.0991 54.2269 81.1489 50.2839C81.1459 49.352 81.0636 48.4222 80.9036 47.5046C79.6321 40.9001 77.5531 34.4767 74.7157 28.3785ZM49.3081 49.9096C49.3654 52.0739 50.2717 54.1288 51.83 55.6312C53.454 57.2401 55.256 58.658 57.2007 59.8579L56.4189 61.0261C54.386 59.7583 52.5016 58.2656 50.8022 56.5775C49.0077 54.8155 47.9693 52.424 47.9067 49.9096H46.365C46.3884 49.2561 46.454 48.6049 46.5635 47.9597C47.392 43.539 48.6153 39.2014 50.2181 34.9997C50.8724 33.2942 51.4565 31.8815 51.8881 30.9126C52.0398 30.5624 52.1681 30.2938 52.2737 30.0598H72.9287C75.5284 35.7777 77.4444 41.7823 78.639 47.9483C78.7499 48.5966 78.8118 49.2523 78.8254 49.9096H49.3081Z" fill="black" />
              </g>
              <defs>
                <clipPath id="clip0_15_3">
                  <rect width="128" height="130" fill="white" transform="matrix(-1 0 0 1 128 0)" />
                </clipPath>
              </defs>
            </svg>

          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-800">Speak Your Menu</h1>
          <p className="text-lg text-gray-600 mt-2">Create Your Account</p>
          <p className="text-sm text-gray-500 mt-1">Sign up to start your menu management journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Snackbar
            open={showError}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          </Snackbar>

          {/* First Name Input */}
          <div className="relative">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 text-left">First Name</label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className=" w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          {/* Last Name Input */}
          <div className="relative">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 text-left">Last Name</label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className=" w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>

          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Email Address</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className=" w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">Password</label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className=" w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center z-10 mt-5"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
            </button>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left">Confirm Password</label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className=" w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Role Selection */}
          <div className="relative">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 text-left ">Select Your Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="pl-2 w-full py-3 bg-background border border-gray-300 focus:border-gray-900 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all rounded-xl"
              required
            >
              <option value="director">Director</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* Terms of Service Checkbox */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={handleTermsChange}
              className="h-4 w-4 text-icon border-gray-300 rounded focus:ring-0"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the
              <a href="#" className="text-icon underline mx-1">Terms of Service</a>
              and
              <a href="#" className="text-icon underline ml-1">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="md"
            className="w-full py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-icon hover:bg-#rgb(223 134 141) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading || !termsAccepted}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-icon">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
