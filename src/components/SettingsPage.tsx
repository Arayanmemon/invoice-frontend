'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  ArrowLeft, 
  Monitor, 
  Moon, 
  Sun, 
  Globe, 
  Volume2, 
  VolumeX,
  Zap,
  Database,
  Shield,
  Cpu,
  HardDrive,
  Clock,
  FileText,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import { settingsAPI, UserSettings, UserSettingsUpdate } from '@/services/api'

interface SettingsPageProps {
  onBack: () => void;
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'light', // light, dark, system
    language: 'en',
    timezone: 'UTC',
    soundEnabled: true,
    autoSave: true,
    compactMode: false
  })

  // Processing Settings State
  const [processingSettings, setProcessingSettings] = useState({
    aiModel: 'gemini-2.0-flash',
    ocrAccuracy: 'high',
    autoProcessing: true,
    batchSize: 10,
    retryAttempts: 3,
    timeout: 30
  })

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    loginNotifications: true,
    ipWhitelist: '',
    dataEncryption: true,
    auditLog: true
  })

  // Storage Settings State
  const [storageSettings, setStorageSettings] = useState({
    retentionDays: 365,
    autoCleanup: true,
    compressionEnabled: true,
    backupFrequency: 'weekly'
  })

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsAPI.getSettings()
        
        setGeneralSettings({
          theme: settings.theme,
          language: settings.language,
          timezone: settings.timezone,
          soundEnabled: settings.sound_enabled,
          autoSave: settings.auto_save,
          compactMode: settings.compact_mode
        })
        
        setProcessingSettings({
          aiModel: settings.ai_model,
          ocrAccuracy: settings.ocr_accuracy,
          autoProcessing: settings.auto_processing,
          batchSize: settings.batch_size,
          retryAttempts: settings.retry_attempts,
          timeout: settings.timeout_seconds
        })
        
        setSecuritySettings({
          twoFactorAuth: settings.two_factor_auth,
          sessionTimeout: settings.session_timeout,
          loginNotifications: settings.login_notifications,
          ipWhitelist: settings.ip_whitelist || '',
          dataEncryption: settings.data_encryption,
          auditLog: settings.audit_log
        })
        
        setStorageSettings({
          retentionDays: settings.retention_days,
          autoCleanup: settings.auto_cleanup,
          compressionEnabled: settings.compression_enabled,
          backupFrequency: settings.backup_frequency
        })
        
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setIsInitialLoad(false)
      }
    }
    
    loadSettings()
  }, [])

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true)
    try {
      let updateData: UserSettingsUpdate = {}
      
      if (category === 'general') {
        updateData = {
          theme: generalSettings.theme,
          language: generalSettings.language,
          timezone: generalSettings.timezone,
          sound_enabled: generalSettings.soundEnabled,
          auto_save: generalSettings.autoSave,
          compact_mode: generalSettings.compactMode
        }
      } else if (category === 'processing') {
        updateData = {
          ai_model: processingSettings.aiModel,
          ocr_accuracy: processingSettings.ocrAccuracy,
          auto_processing: processingSettings.autoProcessing,
          batch_size: processingSettings.batchSize,
          retry_attempts: processingSettings.retryAttempts,
          timeout_seconds: processingSettings.timeout
        }
      } else if (category === 'security') {
        updateData = {
          two_factor_auth: securitySettings.twoFactorAuth,
          session_timeout: securitySettings.sessionTimeout,
          login_notifications: securitySettings.loginNotifications,
          ip_whitelist: securitySettings.ipWhitelist,
          data_encryption: securitySettings.dataEncryption,
          audit_log: securitySettings.auditLog
        }
      } else if (category === 'storage') {
        updateData = {
          retention_days: storageSettings.retentionDays,
          auto_cleanup: storageSettings.autoCleanup,
          compression_enabled: storageSettings.compressionEnabled,
          backup_frequency: storageSettings.backupFrequency
        }
      }
      
      await settingsAPI.updateSettings(updateData)
      toast.success(`${category} settings saved successfully!`)
    } catch (error) {
      toast.error(`Failed to save ${category} settings`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = async (category: string) => {
    if (window.confirm(`Are you sure you want to reset ${category} settings to default?`)) {
      try {
        let defaultSettings: UserSettingsUpdate = {}
        
        if (category === 'general') {
          defaultSettings = {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            sound_enabled: true,
            auto_save: true,
            compact_mode: false
          }
          setGeneralSettings({
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            soundEnabled: true,
            autoSave: true,
            compactMode: false
          })
        } else if (category === 'processing') {
          defaultSettings = {
            ai_model: 'gemini-2.0-flash',
            ocr_accuracy: 'high',
            auto_processing: true,
            batch_size: 10,
            retry_attempts: 3,
            timeout_seconds: 30
          }
          setProcessingSettings({
            aiModel: 'gemini-2.0-flash',
            ocrAccuracy: 'high',
            autoProcessing: true,
            batchSize: 10,
            retryAttempts: 3,
            timeout: 30
          })
        }
        
        await settingsAPI.updateSettings(defaultSettings)
        toast.success(`${category} settings reset to default`)
      } catch (error) {
        toast.error(`Failed to reset ${category} settings`)
      }
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'processing', name: 'Processing', icon: Cpu },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'storage', name: 'Storage', icon: HardDrive }
  ]

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Settings...</h2>
          <p className="text-gray-500">Please wait while we load your preferences.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
              Application Settings
            </h1>
            <div className="w-32"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings Categories</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Appearance & Behavior</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveSettings('general')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => handleResetSettings('general')}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                      <div className="space-y-2">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor }
                        ].map(({ value, label, icon: Icon }) => (
                          <label key={value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="theme"
                              value={value}
                              checked={generalSettings.theme === value}
                              onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <Icon className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Timezone</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">Greenwich Mean Time</option>
                        <option value="CET">Central European Time</option>
                      </select>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Preferences</label>
                      
                      {[
                        { key: 'soundEnabled', label: 'Sound Effects', icon: Volume2 },
                        { key: 'autoSave', label: 'Auto-save Documents', icon: Save },
                        { key: 'compactMode', label: 'Compact Mode', icon: Monitor }
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900">{label}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={generalSettings[key as keyof typeof generalSettings] as boolean}
                              onChange={(e) => setGeneralSettings({ ...generalSettings, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Settings */}
            {activeTab === 'processing' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Document Processing</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveSettings('processing')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">AI Model</label>
                      <select
                        value={processingSettings.aiModel}
                        onChange={(e) => setProcessingSettings({ ...processingSettings, aiModel: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">OCR Accuracy</label>
                      <select
                        value={processingSettings.ocrAccuracy}
                        onChange={(e) => setProcessingSettings({ ...processingSettings, ocrAccuracy: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="high">High (Slower, More Accurate)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="fast">Fast (Quicker, Less Accurate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Batch Size</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={processingSettings.batchSize}
                        onChange={(e) => setProcessingSettings({ ...processingSettings, batchSize: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Timeout (seconds)</label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={processingSettings.timeout}
                        onChange={(e) => setProcessingSettings({ ...processingSettings, timeout: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-900 font-medium">Auto-processing</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={processingSettings.autoProcessing}
                          onChange={(e) => setProcessingSettings({ ...processingSettings, autoProcessing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveSettings('security')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Security Status: Good</p>
                          <p className="text-sm text-green-700 mt-1">
                            Your account is secure with current settings.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Session Timeout (minutes)</label>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={480}>8 hours</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">IP Whitelist</label>
                        <input
                          type="text"
                          placeholder="192.168.1.1, 10.0.0.1"
                          value={securitySettings.ipWhitelist}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
                        { key: 'loginNotifications', label: 'Login Notifications', description: 'Get notified of new login attempts' },
                        { key: 'dataEncryption', label: 'Data Encryption', description: 'Encrypt data at rest and in transit' },
                        { key: 'auditLog', label: 'Audit Logging', description: 'Keep detailed logs of all activities' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-gray-900 font-medium">{label}</p>
                            <p className="text-sm text-gray-600">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings[key as keyof typeof securitySettings] as boolean}
                              onChange={(e) => setSecuritySettings({ ...securitySettings, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Storage Settings */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Storage & Data Management</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveSettings('storage')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Storage Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-blue-600">Documents</p>
                            <p className="text-xl font-bold text-blue-900">234</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <HardDrive className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="text-sm text-green-600">Storage Used</p>
                            <p className="text-xl font-bold text-green-900">2.4 GB</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-8 h-8 text-yellow-600" />
                          <div>
                            <p className="text-sm text-yellow-600">Retention</p>
                            <p className="text-xl font-bold text-yellow-900">{storageSettings.retentionDays} days</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Data Retention (days)</label>
                        <select
                          value={storageSettings.retentionDays}
                          onChange={(e) => setStorageSettings({ ...storageSettings, retentionDays: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={30}>30 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>180 days</option>
                          <option value={365}>1 year</option>
                          <option value={730}>2 years</option>
                          <option value={-1}>Forever</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Backup Frequency</label>
                        <select
                          value={storageSettings.backupFrequency}
                          onChange={(e) => setStorageSettings({ ...storageSettings, backupFrequency: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'autoCleanup', label: 'Auto Cleanup', description: 'Automatically delete old files based on retention policy' },
                        { key: 'compressionEnabled', label: 'File Compression', description: 'Compress files to save storage space' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-gray-900 font-medium">{label}</p>
                            <p className="text-sm text-gray-600">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={storageSettings[key as keyof typeof storageSettings] as boolean}
                              onChange={(e) => setStorageSettings({ ...storageSettings, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Storage Actions */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Storage Actions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                          <Download className="w-5 h-5" />
                          <span>Export Data</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors">
                          <RefreshCw className="w-5 h-5" />
                          <span>Clean Old Files</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors">
                          <Trash2 className="w-5 h-5" />
                          <span>Clear All Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}