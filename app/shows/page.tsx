import { getPopularSeries } from '@/lib/actions/movies';
import { ShowsPageClient } from './components/showspage';

interface PageProps {
  searchParams:  Promise<{ page?: string }>; // ✅ Теперь Promise
}

export default async function ShowsPage({ searchParams }: PageProps) {
  // ✅ Ждем searchParams
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  // Загружаем начальные данные на сервере
  const initialData = await getPopularSeries(currentPage);

  return (
    <ShowsPageClient 
      initialData={initialData}
      initialPage={currentPage}
    />
  );
}