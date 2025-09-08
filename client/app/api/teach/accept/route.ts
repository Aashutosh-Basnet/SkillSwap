import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required', error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/teach/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Teach accept API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
