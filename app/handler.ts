import React from 'react';
import getPopularMovies from '@/lib/actions/movies';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default async function getPopular(page: number) {
  const data = await getPopularMovies(page);
  const movies: Movie[] = data.results;

return movies
}