'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Calendar, 
  Shield, 
  Key,
  Bell,
  Download,
  Trash2,
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI, profileAPI, UserSettings, settingsAPI } from '@/services/api'
import toast from 'react-hot-toast'

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    processingAlerts: true,
    securityAlerts: true,
    weeklyReports: false
  })

  // Load user settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsAPI.getSettings()
        setNotifications({
          emailNotifications: settings.email_notifications,
          processingAlerts: settings.processing_alerts,
          securityAlerts: settings.security_alerts,
          weeklyReports: settings.weekly_reports
        })
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadSettings()
  }, [])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await profileAPI.updateProfile(profileData.name)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      await profileAPI.changePassword(passwordData.currentPassword, passwordData.newPassword)
      toast.success('Password changed successfully!')
      setIsChangingPassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await profileAPI.deleteAccount()
        toast.success('Account deleted successfully')
        logout()
      } catch (error) {
        toast.error('Failed to delete account')
      }
    }
  }

  const handleExportData = async () => {
    try {
      await profileAPI.exportData()
      toast.success('Data export will be sent to your email')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      // Update local state
      setNotifications({ ...notifications, [key]: value })
      
      // Update backend
      const settingsUpdate = {
        email_notifications: key === 'emailNotifications' ? value : undefined,
        processing_alerts: key === 'processingAlerts' ? value : undefined,
        security_alerts: key === 'securityAlerts' ? value : undefined,
        weekly_reports: key === 'weeklyReports' ? value : undefined
      }
      
      // Remove undefined values
      Object.keys(settingsUpdate).forEach(k => 
        settingsUpdate[k as keyof typeof settingsUpdate] === undefined && 
        delete settingsUpdate[k as keyof typeof settingsUpdate]
      )
      
      await settingsAPI.updateSettings(settingsUpdate)
      toast.success('Notification preferences updated')
    } catch (error) {
      // Revert local state on error
      setNotifications({ ...notifications })
      toast.error('Failed to update notification preferences')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Verified</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Since {new Date(user?.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Account Security</p>
                      <p className="text-sm text-gray-600">Two-factor authentication enabled</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {new Date(user?.created_at || '').toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setProfileData({ name: user?.name || '', email: user?.email || '' })
                      }}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
              
              {!isChangingPassword ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {key === 'emailNotifications' && 'Email Notifications'}
                          {key === 'processingAlerts' && 'Document Processing Alerts'}
                          {key === 'securityAlerts' && 'Security Alerts'}
                          {key === 'weeklyReports' && 'Weekly Summary Reports'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'processingAlerts' && 'Get notified when documents are processed'}
                          {key === 'securityAlerts' && 'Important security and login alerts'}
                          {key === 'weeklyReports' && 'Weekly summary of your activity'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Data & Privacy</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export My Data</span>
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Data Privacy Notice</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      We take your privacy seriously. Your data is encrypted and stored securely. 
                      Deleting your account will permanently remove all your data from our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}