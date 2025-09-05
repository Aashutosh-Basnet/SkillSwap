import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

console.log('🔧 API Route Initialized - BACKEND_URL:', BACKEND_URL);

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authorization token required', error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    console.log('PUT /api/user/profile - Received request');
    console.log('BACKEND_URL:', BACKEND_URL);
    console.log('Token present:', !!token);
    console.log('Request body keys:', Object.keys(body));
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authorization token required', error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', response.status);
    
    const data = await response.json();
    console.log('Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR', details: error.message },
      { status: 500 }
    );
  }
} 