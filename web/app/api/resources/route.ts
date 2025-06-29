import { NextResponse } from 'next/server';
import { getResources, saveResource } from '@/lib/database';

export async function GET() {
  try {
    const resources = await getResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resource = await saveResource(body);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Failed to save resource:', error);
    return NextResponse.json(
      { error: 'Failed to save resource' },
      { status: 500 }
    );
  }
}