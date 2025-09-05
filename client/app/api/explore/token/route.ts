import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('POST /api/explore/token - Received request');
    console.log('BACKEND_URL:', BACKEND_URL);
    console.log('Request body:', body);

    const response = await fetch(`${BACKEND_URL}/api/explore/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', response.status);
    
    const data = await response.json();
    console.log('Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR', details: error.message },
      { status: 500 }
    );
  }
}
