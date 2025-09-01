import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
 const HeroBannerSkeleton = () => (
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
 const MovieCardSkeleton = () => (
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
const MoviesGridSkeleton = ({ count = 14 }) => (
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