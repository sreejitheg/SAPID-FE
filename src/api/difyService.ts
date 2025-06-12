import { Message, Document, Conversation, DynamicForm } from '../types';

interface DifyResponse {
  event: string;
  message_id?: string;
  conversation_id?: string;
  answer?: string;
  created_at?: number;
}

interface ChatRequest {
  inputs: Record<string, any>;
  query: string;
  response_mode: 'streaming' | 'blocking';
  conversation_id?: string;
  user: string;
  files?: Array<{
    type: 'image' | 'document';
    transfer_method: 'remote_url' | 'local_file';
    url?: string;
    upload_file_id?: string;
  }>;
}

class DifyService {
  private sessionId: string | null = null;
  private baseUrl = '/api/chat'; // BFF endpoint

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async createSession(): Promise<{ id: string; created_at: string }> {
    // Generate a client-side session ID for conversation management
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.sessionId = sessionId;
    
    return {
      id: sessionId,
      created_at: new Date().toISOString(),
    };
  }

  async deleteSession(): Promise<void> {
    this.sessionId = null;
  }

  async createConversation(title: string): Promise<Conversation> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    // For Dify, conversations are created implicitly when first message is sent
    const newConv: Conversation = {
      id: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title,
      createdAt: new Date(),
    };

    return newConv;
  }

  async getConversations(): Promise<Conversation[]> {
    // In a real implementation, this would fetch from your backend
    // For now, return empty array as Dify doesn't provide conversation listing
    return [];
  }

  async deleteConversation(conversationId: string): Promise<void> {
    // Dify doesn't provide direct conversation deletion
    // This would be handled by your backend
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    // Dify doesn't provide message history retrieval
    // This would be handled by your backend
    return [];
  }

  async uploadDocument(file: File, type: 'permanent' | 'temporary'): Promise<Document> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    // For Dify file uploads, we'd need to implement file upload to Dify's API
    // This is a placeholder implementation
    const mockDoc: Document = {
      id: 'doc_' + Date.now(),
      name: file.name,
      type,
      size: file.size,
      uploadedAt: new Date(),
    };

    return mockDoc;
  }

  async getDocuments(): Promise<Document[]> {
    // Return empty array for now - would be implemented with backend storage
    return [];
  }

  async getDocument(docId: string): Promise<Document> {
    throw new Error('Document not found');
  }

  async deleteDocument(docId: string): Promise<void> {
    // Implementation would depend on your backend
  }

  async *streamChat(message: string, conversationId: string, webSearchEnabled: boolean): AsyncGenerator<any, void, unknown> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const chatRequest: ChatRequest = {
      inputs: {
        web_search_enabled: webSearchEnabled,
      },
      query: message,
      response_mode: 'streaming',
      conversation_id: conversationId || undefined,
      user: this.sessionId,
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to send chat message: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') return;
            
            try {
              const parsed: DifyResponse = JSON.parse(data);
              
              if (parsed.event === 'agent_message' && parsed.answer) {
                yield { type: 'content', content: parsed.answer };
              } else if (parsed.event === 'message' && parsed.answer) {
                yield { type: 'content', content: parsed.answer };
              } else if (parsed.event === 'message_end') {
                yield { type: 'done' };
                return;
              }
            } catch (e) {
              // Skip invalid JSON
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async submitForm(formId: string, data: Record<string, any>): Promise<void> {
    // This would be handled by your backend
    console.log('Form submission:', { formId, data });
  }

  async sendEmail(data: Record<string, any>): Promise<void> {
    // This would be handled by your backend
    console.log('Email send:', data);
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }
}

export const difyService = new DifyService();