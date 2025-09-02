'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSearchResults } from '@/lib/actions/search';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string;
  overview?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getSearchResults(searchQuery, page);
      
      if (data && data.results) {
        // Фильтруем результаты, исключая персон
        const filteredResults = data.results.filter((item: SearchResult) => 
          item.media_type === 'movie' || item.media_type === 'tv'
        );

        if (page === 1) {
          setResults(filteredResults);
        } else {
          setResults(prev => [...prev, ...filteredResults]);
        }
        
        setTotalPages(data.total_pages || 0);
        setTotalResults(data.total_results || 0);
      } else {
        setResults([]);
        setTotalPages(0);
        setTotalResults(0);
      }
    } catch (err) {
      setError('Ошибка при поиске. Попробуйте еще раз.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Выполняем поиск при загрузке страницы или изменении запроса
  useEffect(() => {
    if (query) {
      setCurrentPage(1);
      handleSearch(query, 1);
    }
  }, [query, handleSearch]);

  const loadMore = () => {
    if (!loading && currentPage < totalPages && query.trim()) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      handleSearch(query, nextPage);
    }
  };

  const getTitle = (item: SearchResult): string => {
    return item.title || item.name || 'Без названия';
  };

  const getDate = (item: SearchResult): string => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear().toString() : 'N/A';
  };

  const featuredItem = results.length > 0 ? results[0] : null;

  if (!query) {
    return (
      <div className="min-h-screen bg-black w-full text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Поиск</h1>
          <p className="text-gray-400">Введите запрос для поиска фильмов и сериалов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-30 bg-gradient-to-t from-black to-gray-900 text-white">
      <div className="container mx-auto  px-4 ">
        

        {/* Loading State */}
        {loading && currentPage === 1 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
            <span className="text-gray-400">Поиск...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        

        {/* Results Grid */}
        {results.length > 0 && (
          <>            
            <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full gap-4">
              {results.map((item) => (
                <Link 
                  key={item.id} 
                  className="group relative w-full bg-gray-900 rounded-lg overflow-hidden hover:scale-105 hover:z-10 transition-all duration-300"
                  href={item.media_type === 'movie' ? `/title/${item.id}` : `/titleseries/${item.id}`}
                >
                  <div className="relative w-full ">
                    {item.poster_path ? (
                      <Image
                        width={342}
                        height={500}
                        quality={50}
                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover aspect-[2/3]  "
                        onError={(e) => {
                          e.currentTarget.src = '/noimage.jpg';
                        }}
                      />
                    ) : (
                      <Image
                        width={342}
                        height={500}
                        quality={50}
                        src="/noimage.jpg"
                        alt={getTitle(item)}
                        className="w-full h-full object-cover aspect-[2/3]  "
                      />
                    )}
                    
                    {/* Overlay with info on hover */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {getTitle(item)}
                      </h3>
                      <p className="text-gray-300 text-xs">
                        {item.media_type === 'movie' ? 'Movie' : 'TV Show'} • {getDate(item)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="text-center mt-12">
                <button 
                  onClick={loadMore} 
                  disabled={loading}
                  className="bg-gray-700/30 border border-gray-700 cursor-pointer hover:bg-gray-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Загрузка...
                    </div>
                  ) : (
                    'Загрузить еще'
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {query && !loading && results.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold mb-4">Ничего не найдено</h2>
            <p className="text-gray-400 mb-8">
              По запросу "<span className="font-medium text-white">{query}</span>" результатов не найдено
            </p>
            <Link 
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}