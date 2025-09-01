import { getPopularSeries } from '@/lib/actions/movies';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);

    // Валидация страницы
    if (page < 1 || page > 500) { // TMDB ограничение
      return Response.json(
        { error: 'Invalid page number' }, 
        { status: 400 }
      );
    }

    const data = await getPopularSeries(page);
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to fetch movies' }, 
      { status: 500 }
    );
  }
}