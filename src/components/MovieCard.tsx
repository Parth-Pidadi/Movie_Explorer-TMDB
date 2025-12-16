'use client';

import Image from 'next/image';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onViewDetails: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export default function MovieCard({ 
  movie, 
  onViewDetails, 
  onToggleFavorite,
  isFavorite 
}: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  return (
    <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2">
      {/* Poster */}
      <div 
        className="relative h-[450px] bg-slate-900 cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(movie)}
      >
        {posterUrl ? (
          <>
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-6">
            <svg className="w-20 h-20 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-center text-slate-300 font-semibold text-lg line-clamp-3">
              {movie.title}
            </p>
            <p className="text-slate-500 text-xs mt-2">No poster available</p>
          </div>
        )}

        {/* Favorite Button - Floating */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg z-10 ${
            isFavorite 
              ? 'bg-red-500 text-white scale-110 hover:bg-red-600' 
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-red-400 hover:scale-110'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Hover Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="text-xs text-slate-400 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {movie.overview || 'No description available.'}
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="p-5">
        <h3 
          className="text-lg font-bold text-slate-100 line-clamp-2 cursor-pointer hover:text-amber-400 transition-colors duration-200 mb-2"
          onClick={() => onViewDetails(movie)}
        >
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-amber-400 font-semibold">{year}</span>
          
          {movie.vote_average && (
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-slate-400 font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
