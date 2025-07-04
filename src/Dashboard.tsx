'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  Menu,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-react'
import { FileDiff } from "lucide-react";
import { api, Contract, InvoiceData, ComparisonResult, PriceComparisonDetail, Item as ContractItemBase, InvoiceItem as InvoiceItemBase } from '@/services/api'
import { ContractSection } from './components/ContractSection';
import InvoiceSection from './components/InvoiceSection';
import { ComparisonSection } from './components/ComparisonSection';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
// Patch types to include 'total'
export type ContractItem = ContractItemBase & { total: number };
export type InvoiceItem = InvoiceItemBase & { total: number };
// Mock components - replace with your actual components
interface ComparisonSectionProps {
  allInvoices: InvoiceData[];
  contracts: Contract[];
  onContractsChange: (contracts: Contract[]) => void;
  onRefreshInvoices: () => Promise<void>;
}


interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentInvoiceData, setCurrentInvoiceData] = useState<any>(null)
  const [contracts, setContracts] = useState<any[]>([])
  const [allInvoices, setAllInvoices] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'settings'>('dashboard')

  const fetchContracts = useCallback(async () => {
    try {
      const data = await api.contracts.getAll()
      setContracts(data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
    }
  }, [])

  const fetchInvoices = useCallback(async () => {
    try {
      const data = await api.invoices.getAll()
      setAllInvoices(data)
    } catch (error) {
      console.error('Error fetching all invoices:', error)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
    fetchInvoices()
  }, [fetchContracts, fetchInvoices])

  const handleInvoiceProcessed = async (invoiceData: any) => {
    setCurrentInvoiceData(invoiceData)
    await fetchInvoices()
  }

  const handleContractCreated = async () => {
    await fetchContracts()
  }

  const handleRefreshInvoices = async () => {
    await fetchInvoices()
  }

  const stats = [
    { label: "Total Processed", value: "1,247", icon: <FileText className="w-5 h-5" />, color: "blue" },
    { label: "Success Rate", value: "98.5%", icon: <CheckCircle className="w-5 h-5" />, color: "green" },
    { label: "Time Saved", value: "156h", icon: <Clock className="w-5 h-5" />, color: "pink" },
    { label: "Accuracy", value: "99.5%", icon: <TrendingUp className="w-5 h-5" />, color: "yellow" }
  ]

  // Handle view switching
  if (currentView === 'profile') {
    return <ProfilePage onBack={() => setCurrentView('dashboard')} />
  }

  if (currentView === 'settings') {
    return <SettingsPage onBack={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                  Smart Invoice Validator
                </h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setCurrentView('profile')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => setCurrentView('settings')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-2">
              <button 
                onClick={() => {
                  setCurrentView('profile')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2 w-full text-left py-2 text-gray-700"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentView('settings')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2 w-full text-left py-2 text-gray-700"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 w-full text-left py-2 text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          {/* <p className="text-gray-600">
            Here's what's happening with your invoice validation today.
          </p> */}
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${
                  stat.color === 'blue' ? 'from-blue-100 to-indigo-100' :
                  stat.color === 'green' ? 'from-green-100 to-emerald-100' :
                  stat.color === 'pink' ? 'from-pink-100 to-rose-100' :
                  'from-yellow-100 to-orange-100'
                } p-3 rounded-xl`}>
                  <div className={`${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'pink' ? 'text-pink-600' :
                    'text-yellow-600'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contract Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <ContractSection onContractCreated={handleContractCreated} />
          </div>

          {/* Invoice Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <InvoiceSection
              onInvoiceProcessed={handleInvoiceProcessed}
              onRefreshInvoices={handleRefreshInvoices}
            />
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
        <ComparisonSection
            allInvoices={allInvoices}
            contracts={contracts}
            onContractsChange={setContracts}
            onRefreshInvoices={handleRefreshInvoices}
          />
        </div>

        {/* Recent Activity */}
        {/* <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {[
              { action: "Invoice processed", file: "INV-2024-001.pdf", time: "2 minutes ago", status: "success" },
              { action: "Contract uploaded", file: "Contract-ABC-Corp.pdf", time: "15 minutes ago", status: "success" },
              { action: "Discrepancy detected", file: "INV-2024-002.pdf", time: "1 hour ago", status: "warning" },
              { action: "Validation completed", file: "INV-2024-003.pdf", time: "2 hours ago", status: "success" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className={`w-5 h-5 ${
                        activity.status === 'success' ? 'text-green-600' :
                        activity.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.file}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div> */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-pink-500 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                Smart Invoice Validator
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Help</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 Smart Invoice Validator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}