// Utility to fetch link metadata (title, thumbnail, description)
export const fetchLinkMetadata = async (url: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}> => {
  try {
    // Call our Next.js API route to fetch metadata
    const response = await fetch('/api/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title,
        description: data.description,
        image: data.image,
        icon: data.icon,
      };
    }
  } catch (error) {
    console.error('Error fetching link metadata:', error);
  }

  // Fallback to basic URL info
  try {
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: url,
    };
  } catch {
    return {
      title: url,
    };
  }
};

// Check if a string is a valid URL
export const isValidUrl = (string: string): boolean => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
