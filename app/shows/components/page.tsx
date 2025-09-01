'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPopularSeries } from '@/lib/actions/movies';
import Link from 'next/link';

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

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [series, setSeries] = useState<Series[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Получаем текущую страницу из URL или используем 1 по умолчанию
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchSeries = async (page: number) => {
    setLoading(true);
    try {
      const data: SeriesData = await getPopularSeries(page);
      setSeries(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries(currentPage);
  }, [currentPage]);

  const navigateToPage = (pageNumber: number) => {
    // Обновляем URL с новым номером страницы
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      navigateToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Popular Movies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {series.map((series) => (
          <Link key={series.id} className="bg-white rounded-lg shadow-md overflow-hidden"
            href={`/titleseries/${series.id}`}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
              alt={series.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{series.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {series.release_date}
              </p>
              <p>
                {series.id}
              </p>
              <p className="text-gray-700 text-sm line-clamp-3">
                {series.overview}
              </p>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  ⭐ {series.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          ← Назад
        </button>

        <div className="flex space-x-2">
          {(() => {
            const pages = [];
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            if (startPage > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => navigateToPage(1)}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  1
                </button>
              );
              if (startPage > 2) {
                pages.push(<span key="dots1" className="px-2">...</span>);
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => navigateToPage(i)}
                  className={`px-3 py-2 rounded-lg ${
                    i === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i}
                </button>
              );
            }

            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="px-2">...</span>);
              }
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => navigateToPage(totalPages)}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Вперед →
        </button>
      </div>

      <div className="text-center mt-4 text-gray-600">
        Страница {currentPage} из {totalPages}
      </div>
    </div>
  );
}