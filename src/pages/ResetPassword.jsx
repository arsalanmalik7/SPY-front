import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../components/common/input';
import Button from '../components/common/button';
import { Eye, EyeOff, Lock } from "lucide-react";
import authService from '../services/authService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const token = query.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPassword(token, password)
      if (!res) {
        const data = await res;
        throw new Error(data.message || 'Failed to reset password.');
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-textcolor">Reset Your Password</h2>
        {success ? (
          <div className="text-green-600 text-center mb-4">Password reset successful! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-icon" />
              </div>
              <Input
                id="new-password"
                name="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="pl-10 w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
                minLength={8}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center z-10"
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
              </button>
            </div>
            {/* Confirm New Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-icon" />
              </div>
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pl-10 w-full py-3 bg-transparent border-0 border-gray-300 focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
                minLength={8}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center z-10"
                tabIndex={0}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-icon" /> : <Eye className="h-5 w-5 text-icon" />}
              </button>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 