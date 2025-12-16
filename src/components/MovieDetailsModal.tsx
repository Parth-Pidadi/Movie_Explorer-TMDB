'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Movie, CastMember, CrewMember, Video } from '@/types';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

interface ExtendedMovieDetails extends Movie {
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
}

export default function MovieDetailsModal({
  movie,
  onClose,
  onToggleFavorite,
  isFavorite
}: MovieDetailsModalProps) {
  const [details, setDetails] = useState<ExtendedMovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/movie/${movie.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError('Failed to load movie details. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, [movie.id]);

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const backdropUrl = details?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
    : null;

  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  // Get top 6 cast members
  const topCast = details?.credits?.cast.slice(0, 6) || [];

  // Get notable crew (Director, Writer, Producer, Cinematographer)
  const director = details?.credits?.crew.find(c => c.job === 'Director');
  const writers = details?.credits?.crew.filter(c => c.job === 'Screenplay' || c.job === 'Writer').slice(0, 2);
  const cinematographer = details?.credits?.crew.find(c => c.job === 'Director of Photography');

  // Get official trailer
  const trailer = details?.videos?.results.find(
    v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
  ) || details?.videos?.results.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-xl max-w-6xl w-full my-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-all backdrop-blur-sm"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <svg className="animate-spin h-12 w-12 text-amber-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="bg-red-900 bg-opacity-30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl">
            {/* Backdrop Header */}
            <div className="relative h-80 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
              {/* Shimmer Loading Effect */}
              {backdropUrl && !backdropLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
              )}

              {backdropUrl && (
                <>
                  <Image
                    src={backdropUrl}
                    alt={movie.title}
                    fill
                    priority
                    className={`object-cover transition-opacity duration-500 ${
                      backdropLoaded ? 'opacity-40' : 'opacity-0'
                    }`}
                    sizes="(max-width: 1536px) 100vw, 1536px"
                    onLoad={() => setBackdropLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
                </>
              )}
              
              {/* Title & Rating Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {movie.title}
                    </h2>
                    {details?.tagline && (
                      <p className="text-amber-400 italic text-lg drop-shadow-lg">
                        "{details.tagline}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onToggleFavorite(movie)}
                    className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-slate-800 bg-opacity-80 text-slate-400 hover:bg-slate-700 hover:text-red-400'
                    }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">
              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Year:</span>
                  <span className="text-amber-400 font-medium">{year}</span>
                </div>
                {details?.runtime && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Runtime:</span>
                    <span className="text-amber-400 font-medium">{details.runtime} min</span>
                  </div>
                )}
                {details?.vote_average && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Rating:</span>
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {details.vote_average.toFixed(1)}/10
                    </span>
                    <span className="text-slate-500 text-xs">({details.vote_count?.toLocaleString()} votes)</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {details?.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-slate-800 text-amber-400 rounded-full text-sm font-medium border border-slate-700"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded"></span>
                  Overview
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Notable Crew */}
              {(director || (writers && writers.length > 0) || cinematographer) && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded"></span>
                    Notable Crew
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {director && (
                      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-amber-400 font-semibold">{director.name}</p>
                        <p className="text-slate-400 text-sm">Director</p>
                      </div>
                    )}
                    {writers && writers.map((writer, idx) => (
                      <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-amber-400 font-semibold">{writer.name}</p>
                        <p className="text-slate-400 text-sm">{writer.job}</p>
                      </div>
                    ))}
                    {cinematographer && (
                      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-amber-400 font-semibold">{cinematographer.name}</p>
                        <p className="text-slate-400 text-sm">Cinematography</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cast */}
              {topCast.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded"></span>
                    Top Cast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {topCast.map(cast => (
                      <div key={cast.id} className="text-center">
                        <div className="relative w-full aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                          {cast.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                              alt={cast.name}
                              fill
                              className="object-cover"
                              sizes="150px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-slate-200 font-medium text-sm">{cast.name}</p>
                        <p className="text-slate-500 text-xs">{cast.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer */}
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded"></span>
                  Trailer
                </h3>
                {trailer ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-slate-400 text-sm">No trailer available for this movie</p>
                      <p className="text-slate-500 text-xs mt-2">Trailer data is provided by TMDB and may not be available for all movies</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
