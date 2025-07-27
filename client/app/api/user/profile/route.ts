import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

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
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
} 