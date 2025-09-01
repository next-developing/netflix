'use client';
import { useState, useEffect } from 'react';

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

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
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

export default function SearchInput({ onSearch, onClear, loading = false }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  // Вызываем поиск при изменении дебаунсированного запроса
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="relative mb-5 pl-5">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Поиск фильмов и сериалов..."
        className="w-80 pl-4 pr-10 py-3 text-base border-2 border-gray-300 rounded-full 
                   outline-none transition-colors duration-200 focus:border-red-500 text-white bg-gray-800"
      />
      {query && (
        <button 
          onClick={handleClear} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     bg-transparent border-none text-lg cursor-pointer text-gray-500 
                     hover:text-gray-700 transition-colors duration-200"
        >
          ✕
        </button>
      )}
      
      {/* Индикатор загрузки рядом с полем поиска */}
      {loading && (
        <div className="absolute -right-10 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
        </div>
      )}
    </div>
  );
}