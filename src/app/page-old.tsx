
//old one no styling
// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { ComparisonSection } from '@/components/ComparisonSection'
// import { ContractSection } from '@/components/ContractSection'
// import InvoiceSection from '@/components/InvoiceSection'
// import { InvoiceData, Contract } from '@/services/api'
// import { api } from '@/services/api'

// export default function Home() {
//   const [currentInvoiceData, setCurrentInvoiceData] = useState<InvoiceData | null>(null)
//   const [contracts, setContracts] = useState<Contract[]>([])
//   const [allInvoices, setAllInvoices] = useState<InvoiceData[]>([])

//   const fetchContracts = useCallback(async () => {
//     try {
//       const data = await api.contracts.getAll()
//       setContracts(data)
//     } catch (error) {
//       console.error('Error fetching contracts:', error)
//     }
//   }, [])

//   const fetchInvoices = useCallback(async () => {
//     try {
//       const data = await api.invoices.getAll()
//       setAllInvoices(data)
//     } catch (error) {
//       console.error('Error fetching all invoices:', error)
//     }
//   }, [])

//   useEffect(() => {
//     fetchContracts()
//     fetchInvoices()
//   }, [fetchContracts, fetchInvoices])

//   const handleInvoiceProcessed = async (invoiceData: InvoiceData) => {
//     setCurrentInvoiceData(invoiceData)
//     await fetchInvoices()
//   }

//   const handleContractCreated = async () => {
//     await fetchContracts()
//   }

//   const handleRefreshInvoices = async () => {
//     await fetchInvoices()
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 p-8">
//       <div className="max-w-7xl mx-auto space-y-10">
//         <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-neon mb-16">
//           Smart Invoice Validator
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//           <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg shadow-indigo-700/40 hover:shadow-indigo-600/60 transition-shadow duration-300">
//             <ContractSection onContractCreated={handleContractCreated} />
//           </section>

//           <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg shadow-pink-700/40 hover:shadow-pink-600/60 transition-shadow duration-300">
//             <InvoiceSection
//               onInvoiceProcessed={handleInvoiceProcessed}
//               onRefreshInvoices={handleRefreshInvoices}
//             />
//           </section>
//         </div>

//         <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg shadow-green-700/40 hover:shadow-green-600/60 transition-shadow duration-300">
//           <ComparisonSection
//             allInvoices={allInvoices}
//             contracts={contracts}
//             onContractsChange={setContracts}
//             onRefreshInvoices={handleRefreshInvoices}
//           />
//         </section>
//       </div>
//     </main>
//   )
// }


//new one styling 
'use client'
import { useState, useEffect, useCallback } from 'react'
import React from 'react';
import Dashboard from '@/Dashboard';
import { 
  Upload, 
  FileText, 
  Search, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Shield, 
  Clock, 
  Users,
  Zap
} from 'lucide-react';
import { 
 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

// Login Page Component
interface LoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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

    {/* Testimonials - show fewer or reduce spacing */}
    <div className="space-y-6">
      {testimonials.slice(0, 2).map((testimonial, index) => (
        <div 
          key={index} 
          className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-start space-x-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div className="flex-1">
              <p className="text-white/90 mb-2 leading-relaxed">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-blue-200">{testimonial.role}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-xl font-bold text-yellow-300 mb-1">{stat.number}</div>
          <div className="text-xs text-blue-200 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Right Section - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/3 px-8 py-16 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                  Smart Invoice
                </h1>
                <p className="text-sm text-gray-500 font-medium">Validator</p>
              </div>
            </div>
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
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-3 border-2 border-gray-200 px-6 py-4 rounded-full font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
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
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-3 bg-[#0077B5] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#006396] transition-all duration-300 shadow-lg hover:shadow-xl"
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                }
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password */}
          {!isSignup && (
            <div className="text-center mt-6">
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Forgot your password?
              </button>
            </div>
          )}

          {/* Terms */}
          {isSignup && (
            <p className="text-sm text-gray-500 text-center mt-6 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function page() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');

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

  if (currentView === 'login') {
    return <LoginPage onLogin={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={() => setCurrentView('landing')} />;
  }

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
              Our advanced AI technology streamlines your invoice validation process with cutting-edge OCR and intelligent comparison algorithms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes invoice validation simple and efficient
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-br from-blue-600 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Why Choose Smart Invoice Validator?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-100 to-pink-100 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-level encryption and compliance with industry standards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-100 to-pink-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                    <p className="text-gray-600">Process hundreds of invoices in minutes, not hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-100 to-pink-100 p-3 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Accuracy</h3>
                    <p className="text-gray-600">Machine learning algorithms that improve with every document</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-pink-500 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                      Processing Complete
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Validation Report</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Total Amount</span>
                      <span className="text-green-600 font-semibold">✓ Verified</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Vendor Details</span>
                      <span className="text-green-600 font-semibold">✓ Verified</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Tax Rate</span>
                      <span className="text-red-600 font-semibold">⚠ Discrepancy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Finance Teams
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Smart Invoice Validator
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Invoice Validation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of finance professionals who trust Smart Invoice Validator for accurate, fast document processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentView('login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Free Trial
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
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

export default page;