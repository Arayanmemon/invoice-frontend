'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface AuthenticatedLoginPageProps {
  onBack?: () => void;
  onSuccess: () => void;
}

export function AuthenticatedLoginPage({ onBack, onSuccess }: AuthenticatedLoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isSubmittingForgotPassword, setIsSubmittingForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login, register } = useAuth();

  const testimonials = [
    {
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
      text: 'Smart Invoice Validator transformed our finance workflow completely. The OCR accuracy is incredible!',
      name: 'Anna Chen',
      role: 'Finance Director, TechCorp'
    },
    {
      image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
      text: 'Processing hundreds of invoices now takes minutes instead of hours. Game changer!',
      name: 'Michael Rodriguez',
      role: 'Accounting Manager, StartupXYZ'
    },
    {
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
      text: 'The AI-powered validation catches discrepancies we used to miss. Outstanding tool!',
      name: 'Emma Thompson',
      role: 'Operations Lead, GlobalTrade'
    }
  ];

  const stats = [
    { number: '18,587+', label: 'Invoices Processed' },
    { number: '7,300+', label: 'Hours Saved' },
    { number: '1,230+', label: 'Happy Customers' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isSignup) {
        if (!formData.name.trim()) {
          throw new Error('Please enter your name');
        }
        await register(formData.email, formData.name, formData.password);
        toast.success('Account created successfully!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'linkedin') => {
    try {
      const oauthUrl = provider === 'google' 
        ? authAPI.getGoogleOAuthUrl() 
        : authAPI.getLinkedInOAuthUrl();
      
      window.location.href = oauthUrl;
    } catch (error) {
      toast.error(`${provider} authentication is not available`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingForgotPassword) return;

    if (!forgotPasswordEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmittingForgotPassword(true);
    try {
      const response = await authAPI.forgotPassword(forgotPasswordEmail);
      toast.success(response.message);
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingForgotPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Testimonials */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-pink-500 text-white w-3/5 px-10 py-12 relative overflow-hidden max-h-screen">
        <div className="absolute inset-0 bg-black/10"></div>

        {onBack && (
          <button 
            onClick={onBack}
            className="relative flex items-center space-x-2 text-blue-100 hover:text-white transition-colors mb-10 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
        )}

        <div className="relative space-y-10 max-w-2xl overflow-y-auto pr-2">
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-snug">
              Join Thousands of
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Smart Finance Teams
              </span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Experience the future of invoice validation with AI-powered accuracy and lightning-fast processing.
            </p>
          </div>

          {/* Testimonials */}
          <div className="space-y-6">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div>
                    <p className="text-blue-50 leading-relaxed mb-3">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-blue-200 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{stat.number}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignup 
                ? 'Join us and start validating invoices smarter' 
                : 'Sign in to continue to your dashboard'
              }
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                !isSignup 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                isSignup 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 border-2 border-gray-200 px-6 py-4 rounded-full font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleOAuthLogin('linkedin')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-[#0077B5] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#006396] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required={isSignup}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={isLoading}
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                }
              </button>
            </div>

            {!isSignup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-500 font-medium text-sm underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>

            {isSignup && (
              <p className="text-center text-sm text-gray-600 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            {/* Header with Brand */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                Reset Password
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Your Password?</h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={isSubmittingForgotPassword}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSubmittingForgotPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForgotPassword}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full font-medium hover:from-blue-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmittingForgotPassword ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}