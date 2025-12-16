import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const genreId = searchParams.get('genreId');
    const popular = searchParams.get('popular');
    const page = searchParams.get('page') || '1';

    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    let url;
    if (popular === 'true') {
      // Fetch popular movies when "All Movies" is selected
      url = `${baseUrl}/movie/popular?api_key=${apiKey}&page=${page}`;
    } else if (genreId) {
      // Fetch movies by genre
      url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
    } else {
      return NextResponse.json(
        { error: 'Either genreId or popular parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!response.ok) {
      throw new Error('Failed to fetch movies from TMDB');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error discovering movies:', error);
    return NextResponse.json(
      { error: 'Failed to discover movies' },
      { status: 500 }
    );
  }
}
