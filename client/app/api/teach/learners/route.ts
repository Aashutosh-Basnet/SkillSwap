import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required', error: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Build backend URL
    const backendUrl = new URL(`${BACKEND_URL}/api/teach/learners`);
    if (skill) {
      backendUrl.searchParams.set('skill', skill);
    }
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Teach learners API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
