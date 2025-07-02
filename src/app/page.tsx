'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedLoginPage } from '@/components/AuthenticatedLoginPage';
import {
  ArrowRight,
  FileText,
  Upload,
  Search,
  CheckCircle,
  Clock,
  Users,
  Zap
} from 'lucide-react';


export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [oauthError, setOauthError] = useState<string | null>(null);
  const router = useRouter();

  // Check for OAuth errors in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (error === 'oauth_failed') {
      setOauthError(message || 'OAuth authentication failed. Please try again.');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // If loading, show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we set up your experience.</p>
        </div>
      </div>
    );
  }

  // If authenticated, will redirect via useEffect above
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Redirecting...</h2>
          <p className="text-gray-500">Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  // If showing login page
  if (currentView === 'login') {
    return (
      <AuthenticatedLoginPage
        onBack={() => setCurrentView('landing')}
        onSuccess={() => {
          // The AuthContext will handle the state change
          // No need to manually set view since useEffect will handle it
        }}
      />
    );
  }

  // Landing page data
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Smart Document Upload",
      description: "Drag and drop or upload invoices in any format - PDF, JPG, PNG, or scanned documents."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced OCR Extraction",
      description: "AI-powered optical character recognition extracts all relevant data with 99.5% accuracy."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Intelligent Comparison",
      description: "Automatically compare extracted data against your records and flag discrepancies."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Instant Validation",
      description: "Get real-time validation results with detailed reports and actionable insights."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Invoice",
      description: "Simply upload your invoice document through our secure platform"
    },
    {
      number: "02",
      title: "OCR Processing",
      description: "Our AI extracts all text and numerical data with precision"
    },
    {
      number: "03",
      title: "Smart Comparison",
      description: "Compare against your database or reference documents"
    },
    {
      number: "04",
      title: "Get Results",
      description: "Receive detailed validation report with highlighted discrepancies"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Finance Director, TechCorp",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      text: "Smart Invoice Validator reduced our invoice processing time by 75%. The OCR accuracy is incredible!"
    },
    {
      name: "Michael Rodriguez",
      role: "Accounting Manager, StartupXYZ",
      image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      text: "Finally, a tool that catches discrepancies we used to miss. It's like having an extra pair of expert eyes."
    },
    {
      name: "Emma Thompson",
      role: "Operations Lead, GlobalTrade",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      text: "The comparison feature is a game-changer. We've eliminated manual errors completely."
    }
  ];

  const stats = [
    { number: "99.5%", label: "OCR Accuracy" },
    { number: "75%", label: "Time Saved" },
    { number: "10K+", label: "Documents Processed" },
    { number: "500+", label: "Happy Customers" }
  ];

  // Landing page
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                Smart Invoice Validator
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
              <button
                onClick={() => setCurrentView('login')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* OAuth Error Alert */}
      {oauthError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 mt-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{oauthError}</p>
            <button 
              onClick={() => setOauthError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Validate Invoices with
                <span className="bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent block">
                  AI Precision
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Upload documents, extract data with OCR technology, and compare against your records instantly.
                Eliminate manual errors and save hours of work with our intelligent validation system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setCurrentView('login')}
                  className="bg-gradient-to-r from-blue-600 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Free Trial
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">Smart Invoice Validator</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Invoice #INV-2024-001 Validated</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Search className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">OCR Processing Complete</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <FileText className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">2 Discrepancies Found</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"> Smart Validation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your invoice processing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It
              <span className="bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, fast, and accurate invoice validation in just four steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-pink-200"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by
              <span className="bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"> Finance Teams</span>
            </h2>
            <p className="text-xl text-gray-600">See what our customers have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Invoice Processing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already saving time with AI-powered validation
          </p>
          <button
            onClick={() => setCurrentView('login')}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Smart Invoice Validator</span>
              </div>
              <p className="text-gray-400">
                AI-powered invoice validation that saves time and eliminates errors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Smart Invoice Validator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}