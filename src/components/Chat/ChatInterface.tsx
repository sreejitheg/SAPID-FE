import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { QuickUpload } from './QuickUpload';
import { DynamicForm } from './DynamicForm';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onQuickUpload: (file: File) => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => void;
  isStreaming: boolean;
  isMobile: boolean;
  conversationTitle?: string;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  onQuickUpload, 
  onEditMessage,
  isStreaming, 
  isMobile,
  conversationTitle 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [showQuickUpload, setShowQuickUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleQuickUpload = async (file: File) => {
    try {
      await onQuickUpload(file);
      setShowQuickUpload(false);
    } catch (error) {
      console.error('Quick upload failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Conversation Header */}
      {conversationTitle && !isMobile && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white truncate">{conversationTitle}</h2>
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto px-4 py-6 space-y-6 ${isMobile ? 'pb-safe' : ''}`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Welcome to SAPID
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your AI-powered assistant for document analysis and task automation.
              </p>
              <div className="grid gap-3 text-sm text-left">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong className="text-gray-900 dark:text-white">Upload documents</strong>
                  <span className="text-gray-600 dark:text-gray-400"> to analyze and discuss</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong className="text-gray-900 dark:text-white">Ask questions</strong>
                  <span className="text-gray-600 dark:text-gray-400"> about your files</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong className="text-gray-900 dark:text-white">Generate reports</strong>
                  <span className="text-gray-600 dark:text-gray-400"> and summaries</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id}>
                <MessageBubble 
                  message={message} 
                  onEdit={onEditMessage}
                  isMobile={isMobile}
                />
                {message.forms && message.forms.map((form) => (
                  <div key={form.id} className="mt-4">
                    <DynamicForm form={form} />
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Fixed at bottom for mobile */}
      <div className={`border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 ${
        isMobile ? 'sticky bottom-0 pb-safe' : ''
      }`}>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowQuickUpload(true)}
            className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your documents..."
              className="w-full resize-none border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={1}
              disabled={isStreaming}
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* Quick Upload Modal */}
      {showQuickUpload && (
        <QuickUpload
          onUpload={handleQuickUpload}
          onClose={() => setShowQuickUpload(false)}
        />
      )}
    </div>
  );
}