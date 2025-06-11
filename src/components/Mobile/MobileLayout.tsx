import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Document, Message, AppSettings, Conversation, SidebarTab } from '../../types';
import { ChatInterface } from '../Chat/ChatInterface';
import { Sidebar } from '../Layout/Sidebar';

interface MobileLayoutProps {
  messages: Message[];
  documents: Document[];
  conversations: Conversation[];
  settings: AppSettings;
  activeTab: SidebarTab;
  activeConversationId?: string;
  onSendMessage: (message: string) => void;
  onQuickUpload: (file: File) => Promise<void>;
  onDocumentDelete: (docId: string) => Promise<void>;
  onSettingsChange: (settings: AppSettings) => void;
  onTabChange: (tab: SidebarTab) => void;
  onNewConversation: () => void;
  onConversationSelect: (id: string) => void;
  onConversationDelete: (id: string) => void;
  onDocumentUpload: (file: File, type: 'permanent' | 'temporary') => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => void;
  isStreaming: boolean;
  isUploading: boolean;
}

export function MobileLayout({
  messages,
  documents,
  conversations,
  settings,
  activeTab,
  activeConversationId,
  onSendMessage,
  onQuickUpload,
  onDocumentDelete,
  onSettingsChange,
  onTabChange,
  onNewConversation,
  onConversationSelect,
  onConversationDelete,
  onDocumentUpload,
  onEditMessage,
  isStreaming,
  isUploading,
}: MobileLayoutProps) {
  const [showMenu, setShowMenu] = useState(false);

  const currentConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className={`flex flex-col h-screen ${settings.darkMode ? 'dark' : ''} bg-white dark:bg-gray-900`}>
      {/* Mobile Header - Fixed */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">SAPID</h1>
          {settings.demoMode && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
              Demo
            </span>
          )}
        </div>
        
        <button
          onClick={() => setShowMenu(true)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Interface - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={onSendMessage}
          onQuickUpload={onQuickUpload}
          onEditMessage={onEditMessage}
          isStreaming={isStreaming}
          isMobile={true}
          conversationTitle={currentConversation?.title}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 w-80 h-full shadow-xl">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Sidebar
              activeTab={activeTab}
              onTabChange={onTabChange}
              onNewConversation={() => {
                onNewConversation();
                setShowMenu(false);
              }}
              conversations={conversations}
              documents={documents}
              settings={settings}
              onConversationSelect={(id) => {
                onConversationSelect(id);
                setShowMenu(false);
              }}
              onConversationDelete={onConversationDelete}
              onDocumentUpload={onDocumentUpload}
              onDocumentDelete={onDocumentDelete}
              onSettingsChange={onSettingsChange}
              isUploading={isUploading}
              activeConversationId={activeConversationId}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}