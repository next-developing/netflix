'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPopularMovies } from '@/lib/actions/movies';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MoviesData {
  results: Movie[];
  total_pages: number;
  page: number;
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Получаем текущую страницу из URL или используем 1 по умолчанию
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const data: MoviesData = await getPopularMovies(page);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
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
    <div className="pl-20 bg-black">
 
      

        {movies.length > 0 && (
  <>
    {/* Главный баннер (первый фильм) */}
    <div className=" w-full h-[70vh] mb-8 overflow-hidden ">
      <img 
        src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path || movies[0].poster_path}`}
        alt={movies[0].title}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent " />
        <div className="absolute inset-0 bg-gradient-to-t from-black/99 via-black/10 to-transparent " />
      <div className="absolute bottom-8 left-8 max-w-xl text-white pl-20 top-1/2 transform -translate-y-1/2">
        <h1 className="text-5xl font-bold mb-4">{movies[0].title}</h1>
        <p className="text-lg mb-4 line-clamp-3">
          {movies[0].overview}
        </p>
        <div className="flex items-center gap-4 mb-6">
          <span className="inline-block bg-yellow-500 text-black text-sm px-3 py-1 rounded font-semibold">
            ⭐ {movies[0].vote_average.toFixed(1)}
          </span>
          <span className="text-gray-300">
            {movies[0].release_date}
          </span>
        </div>
        <div className="flex gap-4">
          <Link 
            href={`/title/${movies[0].id}`}
            className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
           <h2>Play</h2>
          </Link>
          <button className="bg-gray-600/80 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600 transition-colors">
    <h2>More Info</h2>
          </button>
        </div>
      </div>
    </div>

    {/* Остальные фильмы в виде сетки */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 px-5">
      {movies.slice(1).map((movie) => (
        <Link 
          key={movie.id} 
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
          href={`/title/${movie.id}`}
        >
          <div className="relative w-full ">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto object-cover  group-hover:border-red-600 transition-all"
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          </div>
          
          
        </Link>
      ))}
    </div>
  </>
)}


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