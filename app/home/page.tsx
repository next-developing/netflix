import { getTrendingAll } from '@/lib/actions/movies'; // Используем вашу существующую функцию
import { MoviesPageClient } from './components/trendingpage';

interface PageProps {
  searchParams:  Promise<{ page?: string }>; // ✅ Теперь Promise
}

export default async function MoviesPage({ searchParams }: PageProps) {
  // ✅ Ждем searchParams
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  // Загружаем начальные данные на сервере
  const initialData = await getTrendingAll(currentPage);

  return (
    <MoviesPageClient 
      initialData={initialData}
      initialPage={currentPage}
      
    />
  );
}