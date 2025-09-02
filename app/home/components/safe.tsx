'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTrendingAll } from '@/lib/actions/movies';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';


export const HeroBannerSkeleton = () => (
  <div className="w-full h-[70vh] mb-8 overflow-hidden relative">
    <Skeleton className="w-full h-full absolute top-0 left-0 bg-gray-800" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/99 via-black/10 to-transparent" />
    <div className="absolute bottom-8 left-8 max-w-xl md:pl-20 top-1/2 transform -translate-y-1/2 space-y-4">
      {/* Заголовок */}
      <Skeleton className="h-12 w-100 bg-gray-600" />
      
      {/* Описание */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-600" />
        <Skeleton className="h-4 w-full bg-gray-600" />
        <Skeleton className="h-4 w-3/4 bg-gray-600" />
      </div>
      
      {/* Рейтинг и дата */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-16 bg-gray-600 rounded" />
        <Skeleton className="h-4 w-24 bg-gray-600" />
      </div>
      
      {/* Кнопка */}
      <Skeleton className="h-12 w-24 bg-gray-600 rounded" />
    </div>
  </div>
)

// Скелетон для карточки фильма
export const MovieCardSkeleton = () => (
  <div className="group bg-white rounded-lg shadow-md overflow-hidden">
    <div className="relative aspect-[2/3]">
      <Skeleton className="w-full h-full bg-gray-300" />
      {/* Скелетон рейтинга */}
      <div className="absolute top-2 right-2">
        <Skeleton className="h-6 w-12 bg-gray-400 rounded" />
      </div>
    </div>
  </div>
)

// Скелетон для сетки фильмов
export const MoviesGridSkeleton = ({ count = 14 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:px-25 px-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 ">
    {Array.from({ length: count }).map((_, index) => (
      <MovieCardSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
)

// Полный скелетон страницы
export const MoviePageSkeleton = () => (
  <div className="w-full bg-black min-h-screen">
    <HeroBannerSkeleton />
    <MoviesGridSkeleton />
  </div>
)

// Скелетон с анимацией пульса
export const AnimatedMoviePageSkeleton = () => (
  <div className="md:px-20 bg-black min-h-screen animate-pulse">
    <HeroBannerSkeleton />
    <MoviesGridSkeleton />
  </div>
)
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
      const data: MoviesData = await getTrendingAll(page);
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

      <MoviePageSkeleton />

    );
  }

  return (
    <div className="md:px-20 bg-black">
 
      

        {movies.length > 0 && (
  <>
    {/* Главный баннер (первый фильм) */}
    <div className="  w-full h-[70vh] mb-8 overflow-hidden ">
      <img
      
        src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path || movies[0].poster_path}`}
        alt={movies[0].title}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent " />
        <div className="absolute inset-0 bg-gradient-to-t from-black/99 via-black/10 to-transparent " />
      <div className="absolute   left-8 max-w-xl text-white md:pl-20 top-75 transform -translate-y-1/2">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold mb-4">{movies[0].title}{movies[0].name}</h1>
        <p className="md:text-md text-sm max-w-3/4 md:max-w-full mb-4 pr-4 line-clamp-3">
          {movies[0].overview}
        </p>
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-block bg-yellow-500 text-black text-sm px-3 py-1 rounded font-semibold">
            ⭐   {movies[0].vote_average ? movies[0].vote_average.toFixed(1) : 'N/A'}  {/* ✅ Правильно */}
          </span>
          <span className="text-gray-300">
            {movies[0].release_date}
          </span>
        </div>
        <div className="flex">
          <Link 
            href={`/title/${movies[0].id}`}
            className="bg-white  text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
           <h2>Play</h2>
          </Link>
          
        </div>
      </div>
    </div>

    {/* Остальные фильмы в виде сетки */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 px-5 ">
      {movies.slice(1).map((movie) => (
        <Link 
          key={movie.id} 
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
           href={movie.media_type === 'movie' ? `/title/${movie.id}` : `/titleseries/${movie.id}`}
        >
          <div className="relative    "> {/* Стандартное соотношение для постеров */}
  <Image
    width={300}
    height={500}
    quality={30}
    src={movie.poster_path && movie.poster_path !== 'null'
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/noimage.jpg'
    }
    alt={movie.title}
    className="object-cover group-hover:border-red-600 transition-all"
  />
  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
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
              : 'bg-gray-500 text-white transition-colors duration-300 hover:bg-gray-600 border-2 border-gray-600  cursor-pointer'
          }`}
        >
          ← Back                        
        </button>

        <div className="flex space-x-2">
        
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed '
              : ' bg-gray-500 text-white transition-colors duration-300 hover:bg-gray-600 border-2 border-gray-600  cursor-pointer'
          }`}
        >
          Next →
        </button>
      </div>

      <div className="text-center mt-4 text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}