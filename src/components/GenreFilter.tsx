'use client';

import { useEffect, useState } from 'react';

interface Genre {
  id: number;
  name: string;
}

interface GenreFilterProps {
  onGenreSelect: (genreId: number | null, genreName: string) => void;
  selectedGenreId: number | null;
}

export default function GenreFilter({ onGenreSelect, selectedGenreId }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch('/api/genres');
        if (response.ok) {
          const data = await response.json();
          setGenres(data.genres || []);
        }
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGenres();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <svg className="animate-spin h-6 w-6 text-amber-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Browse by Genre
      </h3>

      <div className="relative">
        {/* Horizontal scrolling container */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {/* Genre Buttons */}
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onGenreSelect(genre.id, genre.name)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedGenreId === genre.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-700/50'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Scroll fade indicators */}
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
