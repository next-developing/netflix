interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
    backdrop_path?: string; // Добавляем для главного баннера
    media_type?: string; // Добавляем для проверки типа медиа
    name: string;
}

interface MoviesData {
  results: Movie[];
  total_pages: number;
  page: number;
}
  

interface Season {
  id: number;
  name: string;
  air_date: string;
  episode_count: number;
  poster_path: string;
  season_number: number;
}
interface Series {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
 season?: Season[]
}

interface SeriesData {
  results: Series[];
  total_pages: number;
  page: number;

} 
export type { Series, SeriesData, Season, Movie, MoviesData };
