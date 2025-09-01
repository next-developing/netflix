'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { MoviesData } from '@/lib/types/datatypes';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedMoviePageSkeleton } from './skeletons';

interface Props {
  initialData: MoviesData;
  initialPage: number;
}


const fetcher = (url: string) => fetch(url).then(r => r.json());

export function MoviesPageClient({ initialData, initialPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);


    // Обновляем currentPage при изменении URL
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || initialPage.toString(), 10);
    setCurrentPage(page);
  }, [searchParams, initialPage]);

  // Используем SWR с начальными данными
  const { data = initialData, isLoading } = useSWR(
    `/api/movies?page=${currentPage}`,
    fetcher,
    {
      fallbackData: currentPage === initialPage ? initialData : undefined,
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  // Prefetch соседних страниц
  useSWR(
    currentPage > 1 ? `/api/movies?page=${currentPage - 1}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  useSWR(
    currentPage < data.total_pages ? `/api/movies?page=${currentPage + 1}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const navigateToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    
    // Оптимистичное обновление URL без ожидания
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading && !data) {
    return <AnimatedMoviePageSkeleton />; // Можно заменить на ваш скелетон
  }

  return (
   <div className="md:px-20 bg-black">
 
      

        {data.results && data.results.length  > 0 && (
  <>
    {/* Главный баннер (первый фильм) */}
    <div className="  w-full h-[70vh] mb-8 overflow-hidden ">
      <img
      
        src={`https://image.tmdb.org/t/p/original${data.results[0].backdrop_path || data[0].poster_path}`}
        alt={data.results[0].title}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent " />
        <div className="absolute inset-0 bg-gradient-to-t from-black/99 via-black/10 to-transparent " />
      <div className="absolute   left-8 max-w-xl text-white md:pl-20 top-75 transform -translate-y-1/2">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold mb-4">{data.results[0].title}{data.results[0].name}</h1>
        <p className="md:text-md text-sm max-w-3/4 md:max-w-full mb-4 pr-4 line-clamp-3">
          {data.results[0].overview}
        </p>
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-block  text-gray-300 text-sm px-3 py-1 rounded ">
            ⭐   {data.results[0].vote_average ? data.results[0].vote_average.toFixed(1) : 'N/A'}  
          </span>
          <span className="text-gray-300">
            {data.results[0].release_date}
          </span>
        </div>
        <div className="flex">
          <Link 
           href={data.results[0].media_type === 'movie' ? `/title/${data.results[0].id}` : `/titleseries/${data.results[0].id}`}
            className="bg-white  text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
           <h2>Play</h2>
          </Link>
          
        </div>
      </div>
    </div>

    {/* Остальные фильмы в виде сетки */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 px-5 ">
      {data.results.slice(1).map((movie) => (
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
    alt={movie.title || movie.name || 'No Title'}
    className="object-cover aspect-[2/3] w-full h-full group-hover:border-red-600 transition-all"
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
    

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-white  text-black px-3 py-2 rounded font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
        >
          ← Previous
        </button>
        
        <div className="flex items-center gap-2">
          {/* Показываем несколько страниц */}
          {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;
            if (pageNum > data.total_pages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => navigateToPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  pageNum === currentPage 
                    ? ' text-white hidden md:inline' 
                    : 'text-gray-600 cursor-pointer transition-colors duration-300 hidden md:inline hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= data.total_pages}
          className="bg-white  text-black px-3 py-2 rounded font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Next →
        </button>
      </div>
      
      <p className="text-center text-gray-600 mt-2">
        Page {currentPage} of {data.total_pages}
      </p>
    </div>
  );
}

