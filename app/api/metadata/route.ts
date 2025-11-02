import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MommyAI/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Extract metadata using regex (simple approach)
    const getMetaContent = (property: string) => {
      const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
        new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'),
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
      }
      return null;
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitle = getMetaContent('og:title');
    const twitterTitle = getMetaContent('twitter:title');
    const title = ogTitle || twitterTitle || (titleMatch ? titleMatch[1] : new URL(url).hostname);

    // Extract description
    const ogDescription = getMetaContent('og:description');
    const twitterDescription = getMetaContent('twitter:description');
    const metaDescription = getMetaContent('description');
    const description = ogDescription || twitterDescription || metaDescription;

    // Extract image
    const ogImage = getMetaContent('og:image');
    const twitterImage = getMetaContent('twitter:image');
    const image = ogImage || twitterImage;

    // Extract icon
    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']*)["']/i);
    let icon = iconMatch ? iconMatch[1] : null;

    // Make icon URL absolute if it's relative
    if (icon && !icon.startsWith('http')) {
      const urlObj = new URL(url);
      icon = new URL(icon, urlObj.origin).href;
    }

    return NextResponse.json({
      title,
      description,
      image,
      icon,
    });

  } catch (error) {
    console.error('Error in metadata API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
