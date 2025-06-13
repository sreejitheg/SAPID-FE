"use client";

import React, { useState, useEffect } from 'react';
import { Monitor, Moon, Sun, Globe, TestTube, Activity, WifiOff, RefreshCw, Shield, User } from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsTabProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsTab({ settings, onSettingsChange }: SettingsTabProps) {
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const checkBackendHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const response = await fetch('http://localhost:8000/health');
      const healthy = response.ok;
      onSettingsChange({ ...settings, backendHealthy: healthy });
    } catch (error) {
      onSettingsChange({ ...settings, backendHealthy: false });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (!settings.demoMode) {
      checkBackendHealth();
    }
  }, [settings.demoMode]);

  const toggleSetting = (key: keyof AppSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const handleUserRoleChange = () => {
    onSettingsChange({ 
      ...settings, 
      userRole: settings.userRole === 'admin' ? 'user' : 'admin' 
    });
  };

  const ModernToggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
        enabled ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Settings</h2>
      </div>

      {/* User Access */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">User Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.userRole === 'admin' ? 
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : 
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              }
              <div>
                <span className="text-sm text-gray-900 dark:text-white">Administrator Mode</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Access to permanent document management</p>
              </div>
            </div>
            <ModernToggle 
              enabled={settings.userRole === 'admin'} 
              onChange={handleUserRoleChange} 
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? 
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : 
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              }
              <span className="text-sm text-gray-900 dark:text-white">Dark Mode</span>
            </div>
            <ModernToggle 
              enabled={settings.darkMode} 
              onChange={() => toggleSetting('darkMode')} 
            />
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">AI Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <span className="text-sm text-gray-900 dark:text-white">Web Search</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Allow AI to search the internet</p>
              </div>
            </div>
            <ModernToggle 
              enabled={settings.webSearchEnabled} 
              onChange={() => toggleSetting('webSearchEnabled')} 
            />
          </div>
        </div>
      </div>

      {/* Development */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Development</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TestTube className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <span className="text-sm text-gray-900 dark:text-white">Demo Mode</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Use mock data for testing</p>
              </div>
            </div>
            <ModernToggle 
              enabled={settings.demoMode} 
              onChange={() => toggleSetting('demoMode')} 
            />
          </div>
        </div>
      </div>

      {/* Backend Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Backend Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                settings.backendHealthy ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <span className="text-sm text-gray-900 dark:text-white">Connection Status</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {settings.demoMode 
                    ? 'Demo mode active' 
                    : settings.backendHealthy 
                      ? 'Connected to localhost:8000' 
                      : 'Backend unavailable'
                  }
                </p>
              </div>
            </div>
            {!settings.demoMode && (
              <button
                onClick={checkBackendHealth}
                disabled={isCheckingHealth}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">System Information</h3>
        <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Version:</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Mode:</span>
            <span>{settings.demoMode ? 'Demo' : 'Production'}</span>
          </div>
          <div className="flex justify-between">
            <span>User Role:</span>
            <span className="capitalize">{settings.userRole}</span>
          </div>
          <div className="flex justify-between">
            <span>API Endpoint:</span>
            <span>{settings.demoMode ? 'Mock Service' : 'localhost:8000'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}