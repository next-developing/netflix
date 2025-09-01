
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, m } from 'framer-motion';

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
     <div className="relative md:mx-auto  max-w-2xl" ref={searchContainerRef}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <AnimatePresence mode="wait">
          {!searchBarOpen && (
            <motion.button 
              type="button"
              onClick={() => setSearchBarOpen(true)}
              className=" cursor-pointer  text-white px-5 -top-3 md:py-2 rounded-full
                         transition-colors duration-200 flex items-center justify-center absolute md:-top-5 md:-left-12  z-50"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                duration: 0.3
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {searchBarOpen && (
            <>
            <motion.div
  className="absolute -top-8 md:-left-15.5 z-50 hidden md:block "
  initial={{
    opacity: 0,
    width: 0,
  }}
  animate={{
    opacity: 1,
    scale: 1,
    x: 0,
    width: "32rem",
  }}
  exit={{
    opacity: 0,
    width: 0,
  }}
  transition={{
    type: "tween",
    ease: "easeInOut",
  

    
    duration: 0.3
  }}
>

              <motion.input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(query.length > 0)}
                placeholder="Title match search..."
                className="w-full pl-4 pr-12 py-4 text-lg border-2 border-gray-300 rounded-2xl 
                           outline-none transition-colors duration-200 focus:border-gray-500 text-white bg-gray-800
                           placeholder-gray-400"
                autoComplete="off"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                whileFocus={{ 
                  scale: 1.02,
                  borderColor: "#ef4444"
                }}
                autoFocus
              />
          
              {/* Search Button */}
              <motion.button
                type="submit"
                className="absolute right-2 top-1/2 transform cursor-pointer -translate-y-1/2 
                            text-white  px-3 py-1.5 rounded-full 
                           transition-colors duration-200 flex items-center justify-center"
                disabled={!query.trim()}
                initial={{ scale: 1, rotate: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, stiffness: 400 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>

              {/* Clear Button */}
              

              {/* Close Button */}
              
            </motion.div>
            <div className="relative w-screen md:hidden ">
            
            <motion.div
  className="absolute -top-5.5 left- z-50 md:hidden block pr-12" 
  initial={{
    opacity: 0,
    width: 0,
  }}
  animate={{
    opacity: 1,
    scale: 1,
    x: 0,
    width: "100%",
  }}
  exit={{
    opacity: 0,
    width: 0,
  }}
  transition={{

    stiffness: 300,
    duration: 0.2
  }}
>

              <motion.input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(query.length > 0)}
                placeholder="Title match search..."
                className="w-full pl-3 pr-12 py-2 text-base border-2 border-gray-500 rounded-4xl 
                           outline-none transition-colors duration-200  text-white bg-gray-800 
                           placeholder-gray-400"
                autoComplete="off"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                whileFocus={{ 
                  scale: 1.02,
                  borderColor: "#ef4444"
                }}
                autoFocus
              />
          
              {/* Search Button */}
              <motion.button
                type="submit"
                className="absolute right-12 top-1/2 transform -translate-y-1/2 
                            text-white px-3 py-1.5 rounded-full 
                           transition-colors duration-200 flex items-center justify-center"
                disabled={!query.trim()}
                initial={{ scale: 1, rotate: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, stiffness: 400 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>

              {/* Clear Button */}
              

              {/* Close Button */}
              
            </motion.div>
            </div>
            </>
          )}
        </AnimatePresence>
      </form>

      
    </div>
  );
}