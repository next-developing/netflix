'use client';

import { useState, useEffect } from 'react';
import { getSeriesById, getSeasons } from "@/lib/actions/movies";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path?: string;
  air_date?: string;
  runtime?: number;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path?: string;
}

interface SeriesPageProps {
  seriesId: number;
  initialSeries: any;
}

export default function NetflixStylePage({ seriesId, initialSeries }: SeriesPageProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const seasons = initialSeries.seasons || [];

  useEffect(() => {
    const loadEpisodes = async () => {
      if (selectedSeason) {
        setLoading(true);
        try {
          const seasonData = await getSeasons(seriesId, selectedSeason);
          setEpisodes(seasonData.episodes || []);
          setSelectedEpisode(null);
          setShowPlayer(false);
        } catch (error) {
          console.error('Error loading episodes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEpisodes();
  }, [selectedSeason, seriesId]);

  const handleEpisodeClick = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedEpisode(null);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Видеоплеер (полноэкранный оверлей) */}
      {showPlayer && selectedEpisode && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="relative h-full">
            <button
              onClick={handleClosePlayer}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
            >
              ✕
            </button>
            <iframe
              src={`https://vidsrc.xyz/embed/tv?tmdb=${seriesId}&season=${selectedSeason}&episode=${selectedEpisode}`}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Хедер с информацией о сериале */}
      <div className="relative h-[60vh] md:h-[50vh] overflow-hidden ">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="absolute bottom-8 left-8 z-20 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            {initialSeries.name || initialSeries.title}
          </h1>
          <div className="flex gap-4 text-sm mb-4">
            <span className="bg-green-600 px-2 py-1 rounded">
              ★ {initialSeries.vote_average?.toFixed(1)}
            </span>
            <span>{initialSeries.first_air_date?.split('-')[0]}</span>
            <span>{initialSeries.number_of_seasons} seasons</span>
          </div>
          <p className="text-gray-300 leading-relaxed pr-10 md:pr-0">
            {initialSeries.overview}
          </p>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/original/${initialSeries.backdrop_path}`}
          alt={initialSeries.name || initialSeries.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Контент */}
      <div className="px-8 py-6">
        {/* Табы сезонов */}
        <div className=" grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-1 mb-8 overflow-x-auto">
          {seasons.map((season: Season) => (
            <button
              key={season.season_number}
              onClick={() => setSelectedSeason(season.season_number)}
              className={`px-6 py-3 rounded-xl  whitespace-nowrap transition-colors duration-300 ease-in-out ${
                selectedSeason === season.season_number
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-300 cursor-pointer hover:bg-gray-700'
              }`}
            >
              {season.name}
            </button>
          ))}
        </div>

        {/* Список эпизодов */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode, index) => (
              <div
                key={episode.id}
                className="flex gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
                onClick={() => handleEpisodeClick(episode.episode_number)}
              >
                {/* Номер эпизода */}
                <div className="flex-shrink-0 w-8 text-2xl font-light text-gray-400">
                  {episode.episode_number}
                </div>

                {/* Превью изображение */}
                <div className="flex-shrink-0 w-32 h-18 bg-gray-700 rounded overflow-hidden relative">
                  {episode.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${episode.still_path}`}
                      alt={episode.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12l-4-4h8l-4 4z" />
                      </svg>
                    </div>
                  )}
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z" />
                    </svg>
                  </div>
                </div>

                {/* Информация об эпизоде */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium truncate pr-4">
                      {episode.name}
                    </h3>
                    <div className="text-sm text-gray-400 flex-shrink-0">
                      {episode.runtime && `${episode.runtime}м`}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {episode.overview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}