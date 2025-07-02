'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileText
} from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/');
      return;
    }

    setToken(tokenParam);
    verifyToken(tokenParam);
  }, [searchParams, router]);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      await authAPI.verifyResetToken(tokenToVerify);
      setIsValidToken(true);
    } catch (error) {
      setIsValidToken(false);
      toast.error('This reset link has expired or is invalid. Please request a new one.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length === 0) {
      return { score: 0, feedback: '' };
    }

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Strong';
        break;
      case 5:
        feedback = 'Very strong';
        break;
      default:
        feedback = '';
    }

    return { score, feedback };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !token) return;

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.resetPassword(token, formData.password);
      toast.success(response.message);
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verifying reset link...</h2>
          <p className="text-gray-500">Please wait while we verify your password reset link.</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          {/* Header with Brand */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
              Smart Invoice Validator
            </span>
          </div>

          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-full font-medium hover:from-blue-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header with Brand */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
            Smart Invoice Validator
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
          <p className="text-gray-600">
            Choose a strong password to secure your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
                disabled={isSubmitting}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                disabled={isSubmitting}
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                }
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.score >= 4 ? 'text-green-600' : 
                    passwordStrength.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: getPasswordStrengthWidth() }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                disabled={isSubmitting}
              >
                {showConfirmPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                }
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || formData.password !== formData.confirmPassword || formData.password.length < 8}
            className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Resetting Password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-500 font-medium text-sm inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}