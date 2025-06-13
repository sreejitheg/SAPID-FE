import React from 'react';
import { Plus, MessageSquare, Trash2, Clock } from 'lucide-react';
import { Conversation } from '../../types';

interface ConversationsTabProps {
  conversations: Conversation[];
  onConversationSelect: (id: string) => void;
  onConversationDelete: (id: string) => void;
  onNewConversation: () => void;
  activeConversationId?: string;
}

export function ConversationsTab({
  conversations,
  onConversationSelect,
  onConversationDelete,
  onNewConversation,
  activeConversationId,
}: ConversationsTabProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } else if (diffInHours < 168) { // 7 days
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  };

  const handleDelete = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation? This will also remove any associated session files.')) {
      onConversationDelete(conversationId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new conversation to begin</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeConversationId === conversation.id
                    ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.title}
                    </h3>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(conversation.createdAt)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}