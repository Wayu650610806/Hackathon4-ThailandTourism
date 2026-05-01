import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://sitthisak17sm-thailand-forecast.hf.space';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const urlPath = searchParams.get('url');

  if (!urlPath) {
    return NextResponse.json({ error: 'URL path is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}${urlPath}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add your API Key here if needed
        // 'x-api-key': process.env.API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from external API' }, { status: 500 });
  }
}
