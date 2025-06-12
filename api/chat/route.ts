import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface DifyRequest {
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

export async function POST(request: NextRequest) {
  try {
    const difyApiKey = process.env.DIFY_API_KEY;
    
    if (!difyApiKey) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY not configured' },
        { status: 500 }
      );
    }

    const body: DifyRequest = await request.json();

    // Validate required fields
    if (!body.query || !body.user) {
      return NextResponse.json(
        { error: 'Missing required fields: query and user' },
        { status: 400 }
      );
    }

    // Proxy request to Dify API
    const difyResponse = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error('Dify API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to communicate with Dify API' },
        { status: difyResponse.status }
      );
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      start(controller) {
        const reader = difyResponse.body?.getReader();
        
        if (!reader) {
          controller.close();
          return;
        }

        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                controller.close();
                break;
              }
              
              controller.enqueue(value);
            }
          } catch (error) {
            console.error('Stream error:', error);
            controller.error(error);
          }
        };

        pump();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}