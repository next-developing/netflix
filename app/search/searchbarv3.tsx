
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const router = useRouter();
  
  // Ref для контейнера поиска
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Обработчик клика вне области поиска
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchBarOpen(false);
        setShowSuggestions(false);
      }
    }

    // Добавляем слушатель только если поиск открыт
    if (searchBarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Очистка слушателя
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchBarOpen]);

  // Функция для получения подсказок (опционально)
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Здесь можно получить несколько подсказок для автокомплита
      // const data = await getSearchResults(searchQuery, 1);
      // if (data?.results) {
      //   const filtered = data.results
      //     .filter((item: SearchResult) => item.media_type === 'movie' || item.media_type === 'tv')
      //     .slice(0, 5); // Показываем только 5 подсказок
      //   setSuggestions(filtered);
      // }
    } catch (error) {
      console.error('Suggestions error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Получаем подсказки при изменении запроса
  useEffect(() => {
    if (showSuggestions) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery, fetchSuggestions, showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearch = (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    // Закрываем подсказки и поиск
    setShowSuggestions(false);
    setSearchBarOpen(false);
    
    // Редирект на страницу с результатами
    router.push(`/search?q=${encodeURIComponent(queryToSearch)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSearchBarOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    const title = suggestion.title || suggestion.name || '';
    setQuery(title);
    handleSearch(title);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const closeSearch = () => {
    setSearchBarOpen(false);
    setShowSuggestions(false);
  };

  const getTitle = (item: SearchResult): string => {
    return item.title || item.name || 'Без названия';
  };

  const getDate = (item: SearchResult): string => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear().toString() : 'N/A';
  };

  return (
     

<div className="relative lg:w-[1200px]  " ref={searchContainerRef}>
  <form onSubmit={handleSubmit} className="relative">
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onFocus={() => setShowSuggestions(query.length > 0)}
      placeholder="Title match search..."
      className="w-full pl-4 pr-12 p-[6px] h-[56px] text-lg border-2 border-gray-300 rounded-sm
                 outline-none transition-colors duration-200 focus:border-[rgb(108,221,215)] text-black bg-gray-800
                 
                 placeholder-gray-400"
      autoComplete="off"
    />
    
    <button
      type="submit"
      className="absolute right-0 top-1/2 transform -translate-y-1/2
                 bg-[rgb(108,221,215)] cursor-pointer text-white h-full px-6 py-1.5 rounded-br-sm rounded-tr-sm
                 transition-colors duration-200 flex items-center justify-center"
      disabled={!query.trim()}
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </form>
</div>
  );
}