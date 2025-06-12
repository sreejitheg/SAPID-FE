import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const difyApiKey = process.env.DIFY_API_KEY;
    
    if (!difyApiKey) {
      return NextResponse.json(
        { 
          status: 'unhealthy',
          error: 'DIFY_API_KEY not configured',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Test connection to Dify API
    const testResponse = await fetch('https://api.dify.ai/v1/parameters', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
      },
    });

    if (!testResponse.ok) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: 'Failed to connect to Dify API',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      dify_connected: true,
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}