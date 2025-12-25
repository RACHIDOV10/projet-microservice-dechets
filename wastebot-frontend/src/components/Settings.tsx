import { Moon, Sun, User, Mail, Building, Shield } from 'lucide-react';

type SettingsProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

export function Settings({ darkMode, setDarkMode }: SettingsProps) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <p className="text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-gray-900 dark:text-white mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                defaultValue="admin@wastebot.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Organization
              </label>
              <input
                type="text"
                defaultValue="WasteBot Industries"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            Save Changes
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-gray-900 dark:text-white mb-4">
            <Shield className="w-5 h-5 inline mr-2" />
            Security
          </h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors text-left">
              Change Password
            </button>
            <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors text-left">
              Enable Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors text-left">
              View Login History
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white">Robot Status Alerts</p>
                <p className="text-gray-500 dark:text-gray-400">Get notified when robot status changes</p>
              </div>
              <button className="relative w-14 h-7 rounded-full bg-green-500">
                <span className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white">Low Battery Warnings</p>
                <p className="text-gray-500 dark:text-gray-400">Alert when robot battery is low</p>
              </div>
              <button className="relative w-14 h-7 rounded-full bg-green-500">
                <span className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white">Detection Reports</p>
                <p className="text-gray-500 dark:text-gray-400">Daily summary of waste detections</p>
              </div>
              <button className="relative w-14 h-7 rounded-full bg-gray-300">
                <span className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
