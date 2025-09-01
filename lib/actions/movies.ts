'use server';

const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;
import type { MoviesData } from '../types/datatypes';

export async function getPopularMovies(page: number) {
try {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    }
  );
  const data = await res.json();
  return data;
} catch (error) {
  console.log(error);
}
}

export async function getTrendingAll(page: number): Promise<MoviesData> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        next: { 
          revalidate: 300,
          tags: ['movies', `page-${page}`]
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}


export async function getMovieById(id: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getPopularSeries(page: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSeriesById(id: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getSeasons(id: number, season_number: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}//season/${season_number}?api_key=${apiKey}&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getEpisodes(id: number, season_number: number, episode_number: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}?api_key=${apiKey}&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },

      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}