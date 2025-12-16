'use client';

import Image from 'next/image';
import { FavoriteMovie } from '@/types';

interface FavoritesListProps {
  favorites: FavoriteMovie[];
  onRemoveFavorite: (id: number) => void;
  onUpdateFavorite: (id: number, updates: Partial<FavoriteMovie>) => void;
  onViewDetails: (movie: FavoriteMovie) => void;
}

export default function FavoritesList({ 
  favorites, 
  onRemoveFavorite, 
  onUpdateFavorite,
  onViewDetails 
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-block p-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          <svg className="w-24 h-24 text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-2xl font-semibold text-slate-300 mb-3">No favorites yet</h3>
          <p className="text-slate-500 max-w-md">Click the heart button on any movie to add it to your favorites!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {favorites.map((movie) => {
        const posterUrl = movie.poster_path 
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : null;

        const year = movie.release_date 
          ? new Date(movie.release_date).getFullYear() 
          : 'N/A';

        return (
          <div
            key={movie.id}
            className="bg-gradient-to-br from-slate-800/90 to-slate-800/50 rounded-2xl overflow-hidden shadow-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row">
              <div
                className="sm:w-48 h-64 sm:h-auto bg-slate-700 flex-shrink-0 cursor-pointer relative group overflow-hidden"
                onClick={() => onViewDetails(movie)}
              >
                {posterUrl ? (
                  <>
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 bg-gradient-to-br from-slate-800 to-slate-900">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="cursor-pointer hover:text-amber-400 transition-colors flex-1"
                    onClick={() => onViewDetails(movie)}
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
                      {movie.title}
                      {movie.personalNote && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Note
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-amber-400 font-medium">{year}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFavorite(movie.id)}
                    className="flex-shrink-0 p-2.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg"
                    aria-label="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Your Rating
                    </label>
                    <select
                      value={movie.personalRating || ''}
                      onChange={(e) => onUpdateFavorite(movie.id, {
                        personalRating: e.target.value ? Number(e.target.value) : undefined
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer hover:border-slate-500"
                    >
                      <option value="">Select rating...</option>
                      <option value="1">⭐ 1 - Poor</option>
                      <option value="2">⭐⭐ 2 - Fair</option>
                      <option value="3">⭐⭐⭐ 3 - Good</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Great</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Personal Notes
                    </label>
                    <textarea
                      value={movie.personalNote || ''}
                      onChange={(e) => onUpdateFavorite(movie.id, {
                        personalNote: e.target.value
                      })}
                      placeholder="Add your thoughts, memories, or why you love this movie..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none hover:border-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
