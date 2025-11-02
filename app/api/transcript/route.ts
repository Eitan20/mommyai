import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.VIDNAVIGATOR_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'VidNavigator API key not configured' },
        { status: 500 }
      );
    }

    // Call VidNavigator API
    const response = await fetch('https://api.vidnavigator.com/v1/transcript', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VidNavigator API error:', response.status, errorText);
      return NextResponse.json(
        {
          error: 'Failed to fetch transcript from VidNavigator API',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the transcript data
    return NextResponse.json({
      transcript: data.transcript || data.text || '',
      title: data.title || data.video_title,
      author: data.author || data.channel || data.creator,
      duration: data.duration || data.length,
      raw: data, // Include raw response for debugging
    });

  } catch (error) {
    console.error('Error in transcript API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
