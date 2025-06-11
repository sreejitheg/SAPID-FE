import React from 'react';
import { MessageSquare } from 'lucide-react';
import { AppSettings } from '../../types';

interface HeaderProps {
  settings: AppSettings;
  isMobile: boolean;
}

export function Header({ settings, isMobile }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">SAPID</h1>
          {settings.demoMode && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md">
              Demo Mode
            </span>
          )}
          {!settings.backendHealthy && !settings.demoMode && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
              Backend Offline
            </span>
          )}
        </div>
      </div>
    </header>
  );
}