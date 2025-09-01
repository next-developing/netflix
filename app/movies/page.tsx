import { getPopularMovies } from '@/lib/actions/movies';
import { MoviesPageClient } from './components/moviespage';

interface PageProps {
  searchParams:  Promise<{ page?: string }>; // ✅ Теперь Promise
}

export default async function ShowsPage({ searchParams }: PageProps) {
  // ✅ Ждем searchParams
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  // Загружаем начальные данные на сервере
  const initialData = await getPopularMovies(currentPage);

  return (
    <MoviesPageClient 
      initialData={initialData}
      initialPage={currentPage}
    />
  );
}