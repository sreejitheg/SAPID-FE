import React from 'react';
import { MessageSquare, FileText, Settings } from 'lucide-react';
import { SidebarTab, AppSettings } from '../../types';
import { ConversationsTab } from './ConversationsTab';
import { DocumentsTab } from './DocumentsTab';
import { SettingsTab } from './SettingsTab';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onNewConversation: () => void;
  conversations: any[];
  documents: any[];
  settings: AppSettings;
  onConversationSelect: (id: string) => void;
  onConversationDelete: (id: string) => void;
  onDocumentDelete: (docId: string) => void;
  onDocumentDelete: (id: string) => void;
  onSettingsChange: (settings: any) => void;
  isUploading: boolean;
  activeConversationId?: string;
  isMobile?: boolean;
}

export function Sidebar({
  activeTab,
  onTabChange,
  onNewConversation,
  conversations,
  documents,
  settings,
  onConversationSelect,
  onConversationDelete,
  onDocumentUpload,
  onDocumentDelete,
  onSettingsChange,
  isUploading,
  activeConversationId,
  isMobile = false,
}: SidebarProps) {
  const tabs = [
    { id: 'conversations' as SidebarTab, icon: MessageSquare },
    { id: 'documents' as SidebarTab, icon: FileText },
    { id: 'settings' as SidebarTab, icon: Settings },
  ];

  const toggleSidebar = () => {
    onSettingsChange({ ...settings, sidebarCollapsed: !settings.sidebarCollapsed });
  };

  const sidebarWidth = settings.sidebarCollapsed ? 'w-16' : 'w-80';

  if (isMobile) {
    return (
      <aside className="w-full bg-white dark:bg-gray-900 flex flex-col h-full">
        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'conversations' && (
            <ConversationsTab
              conversations={conversations}
              onConversationSelect={onConversationSelect}
              onConversationDelete={onConversationDelete}
              onNewConversation={onNewConversation}
              activeConversationId={activeConversationId}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab
              documents={documents.filter(doc => 
                doc.type === 'temporary' && doc.conversationId === activeConversationId
              )}
              onDocumentUpload={onDocumentUpload}
              onDocumentDelete={onDocumentDelete}
              isUploading={isUploading}
              userRole={settings.userRole}
              isMobile={true}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          )}
        </div>

        {/* Tab Navigation - Bottom */}
        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center p-4 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-t-2 border-gray-900 dark:border-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-6 h-6" />
              </button>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${sidebarWidth} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full transition-all duration-300 ease-in-out relative`}>
      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <div className={`w-2 h-2 border-r border-b border-current transform transition-transform ${
          settings.sidebarCollapsed ? 'rotate-[-135deg]' : 'rotate-45'
        }`} />
      </button>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {!settings.sidebarCollapsed && (
          <>
            {activeTab === 'conversations' && (
              <ConversationsTab
                conversations={conversations}
                onConversationSelect={onConversationSelect}
                onConversationDelete={onConversationDelete}
                onNewConversation={onNewConversation}
                activeConversationId={activeConversationId}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsTab
                documents={documents}
                onDocumentUpload={onDocumentUpload}
                onDocumentDelete={onDocumentDelete}
                isUploading={isUploading}
                userRole={settings.userRole}
                isMobile={false}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            )}
          </>
        )}
      </div>

      {/* Tab Navigation - Bottom */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center p-4 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-t-2 border-gray-900 dark:border-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
