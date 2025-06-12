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

## Docker Deployment

### Quick Start with Docker Compose

1. **Clone and setup environment:**
```bash
git clone <your-repo>
cd sapid-ai-app
cp .env.example .env.local
# Edit .env.local and add your DIFY_API_KEY
```

2. **Run with Docker Compose:**
```bash
# Development
docker-compose up --build

# Production with nginx proxy
docker-compose --profile production up --build
```

### Manual Docker Build

```bash
# Build the image
docker build -t sapid-app .

# Run the container
docker run -p 3000:3000 \
  -e DIFY_API_KEY=your_dify_api_key_here \
  --name sapid-container \
  sapid-app
```

### Production Deployment

For production deployment with SSL and nginx:

1. **Configure SSL certificates:**
```bash
mkdir ssl
# Add your SSL certificates to the ssl/ directory
# cert.pem and key.pem
```

2. **Update nginx.conf:**
   - Uncomment HTTPS server block
   - Update server_name with your domain
   - Configure SSL certificate paths

3. **Deploy:**
```bash
docker-compose --profile production up -d
```

### Environment Variables

Create a `.env.local` file with:

```env
DIFY_API_KEY=your_dify_api_key_here
NODE_ENV=production
```

### Health Checks

The application includes health check endpoints:

- **Application health**: `GET /api/health`
- **Container health**: Built-in Docker healthcheck
- **Load balancer health**: `GET /health` (nginx)

### Monitoring

Monitor your deployment:

```bash
# View logs
docker-compose logs -f sapid-app

# Check container status
docker-compose ps

# Monitor resource usage
docker stats
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

docker/
├── Dockerfile          # Multi-stage Docker build
├── docker-compose.yml  # Container orchestration
├── nginx.conf          # Reverse proxy configuration
└── .dockerignore       # Docker ignore patterns
```

## Security

- **No client-side API keys**: All Dify API keys are stored server-side
- **BFF pattern**: Client never directly communicates with Dify
- **Environment variables**: Sensitive data in `.env.local` (not committed)
- **CORS protection**: Proper headers and validation
- **Rate limiting**: nginx-based API rate limiting
- **Security headers**: XSS, CSRF, and content-type protection

## Performance

- **Multi-stage Docker build**: Optimized image size
- **Standalone Next.js output**: Minimal runtime dependencies
- **Gzip compression**: nginx-based compression
- **Image optimization**: WebP and AVIF support
- **SSE streaming**: Efficient real-time communication

## Deployment

### Development
```bash
docker-compose up --build
```

### Production
```bash
# With nginx reverse proxy
docker-compose --profile production up -d

# Or deploy to cloud platforms:
# - Vercel (recommended for Next.js)
# - AWS ECS/Fargate
# - Google Cloud Run
# - Azure Container Instances
```

### Cloud Deployment

1. **Set `DIFY_API_KEY` in your deployment environment**
2. **Build and push to container registry**
3. **Deploy using your preferred cloud platform**
4. **Ensure your Dify API key has appropriate permissions**

## Migration from Direct Dify Integration

This version replaces direct client-side Dify API calls with a secure BFF pattern:

- ✅ **Before**: Client → Dify API (exposed key)
- ✅ **After**: Client → BFF → Dify API (secure key)

All existing functionality is preserved while improving security.