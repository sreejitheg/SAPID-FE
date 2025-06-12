# SAPID - AI-Powered Assistant

SAPID is a modern web application that provides AI-powered document analysis, chat functionality, and task automation through a clean, professional interface. Now powered by Dify AI with a secure Backend-for-Frontend (BFF) architecture.

## Features

- **Unified Chat Interface**: Real-time streaming responses with document integration via Dify AI
- **Document Management**: Upload, view, and manage permanent and temporary documents
- **Conversation Management**: Multiple chat sessions with individual document contexts
- **Settings Management**: Configurable options for web search, demo mode, and themes
- **Responsive Design**: Optimized for both desktop and mobile experiences
- **Demo Mode**: Full functionality testing with mock data
- **Secure BFF Pattern**: API keys protected server-side

## Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your DIFY_API_KEY

# Start development server
npm run dev
```

## Environment Variables

Create a `.env.local` file with:

```env
DIFY_API_KEY=your_dify_api_key_here
```

## Backend Integration

The application uses a Backend-for-Frontend (BFF) pattern with the following API endpoints:

- `POST /api/chat` - Proxies chat requests to Dify AI with streaming support
- `GET /api/health` - Health check endpoint that verifies Dify API connectivity

### Dify Integration

The app integrates with Dify AI through secure server-side proxying:

1. **Client** sends requests to `/api/chat`
2. **BFF** (Next.js API route) proxies to `https://api.dify.ai/v1/chat-messages`
3. **Streaming responses** are passed through unchanged
4. **API keys** remain secure on the server

## Demo Mode

Demo mode provides full functionality testing without requiring Dify integration. Demo data includes:
- Sample conversations with streaming responses
- Mock document uploads and management
- PDF viewing demonstrations
- Form filling examples
- All API touchpoints simulated

## Project Structure

```
src/
├── api/                 # API service and Dify integration
├── app/                 # Next.js app directory
├── components/          # React components
├── demo/               # Demo data and mock services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

api/
├── chat/               # Chat proxy endpoint
└── health/             # Health check endpoint
```

## Security

- **No client-side API keys**: All Dify API keys are stored server-side
- **BFF pattern**: Client never directly communicates with Dify
- **Environment variables**: Sensitive data in `.env.local` (not committed)
- **CORS protection**: Proper headers and validation

## Deployment

1. Set `DIFY_API_KEY` in your deployment environment
2. Build and deploy as a standard Next.js application
3. Ensure your Dify API key has appropriate permissions

## Migration from Direct Dify Integration

This version replaces direct client-side Dify API calls with a secure BFF pattern:

- ✅ **Before**: Client → Dify API (exposed key)
- ✅ **After**: Client → BFF → Dify API (secure key)

All existing functionality is preserved while improving security.