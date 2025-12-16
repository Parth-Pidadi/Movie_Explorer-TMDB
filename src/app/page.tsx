'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Movie, FavoriteMovie } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import FavoritesList from '@/components/FavoritesList';
import GenreFilter from '@/components/GenreFilter';
import RatingModal from '@/components/RatingModal';

type Tab = 'search' | 'favorites';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedGenreName, setSelectedGenreName] = useState<string>('Top 20 Popular Movies');
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [movieToRate, setMovieToRate] = useState<Movie | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavorite,
    isFavorite,
    isLoaded
  } = useFavorites();

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load popular movies on initial page load
  useEffect(() => {
    const loadPopularMovies = async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch('/api/discover?popular=true');

        if (!response.ok) {
          throw new Error('Failed to discover movies');
        }

        const data = await response.json();
        setGenreMovies(data.results || []);
      } catch (error) {
        setSearchError('Failed to fetch movies. Please try again.');
        setGenreMovies([]);
        console.error('Popular movies fetch error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    loadPopularMovies();
  }, []);

  // Handle URL-based movie selection (for browser back/forward button)
  useEffect(() => {
    const movieId = searchParams.get('movieId');

    if (movieId && !selectedMovie) {
      // Fetch movie data when URL contains movieId but modal isn't open
      const fetchMovieFromUrl = async () => {
        try {
          const response = await fetch(`/api/movie/${movieId}`);
          if (response.ok) {
            const movieData = await response.json();
            setSelectedMovie(movieData);
          }
        } catch (error) {
          console.error('Failed to fetch movie from URL:', error);
        }
      };
      fetchMovieFromUrl();
    } else if (!movieId && selectedMovie) {
      // Close modal when URL doesn't have movieId (back button was pressed)
      setSelectedMovie(null);
    }
  }, [searchParams, selectedMovie]);

  // Update URL when movie is selected
  const handleViewDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    const params = new URLSearchParams(searchParams.toString());
    params.set('movieId', movie.id.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Close modal and update URL
  const handleCloseModal = () => {
    setSelectedMovie(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('movieId');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Failed to search movies');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchError('Failed to fetch movies. Please try again.');
      setSearchResults([]);
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      // Show rating modal before adding to favorites
      setMovieToRate(movie);
    }
  };

  const handleRatingSubmit = (rating?: number, note?: string) => {
    if (movieToRate) {
      const favoriteMovie: FavoriteMovie = {
        ...movieToRate,
        favoritedAt: Date.now(),
        personalRating: rating,
        personalNote: note,
      };
      addFavorite(favoriteMovie);
      setMovieToRate(null);
    }
  };

  const handleRatingCancel = () => {
    setMovieToRate(null);
  };

  const handleGenreSelect = async (genreId: number | null, genreName: string) => {
    setSelectedGenreId(genreId);
    setSelectedGenreName(genreName);
    setHasSearched(false);
    setSearchResults([]);

    setIsSearching(true);
    setSearchError(null);

    try {
      // Fetch movies by genre
      const response = await fetch(`/api/discover?genreId=${genreId}`);

      if (!response.ok) {
        throw new Error('Failed to discover movies');
      }

      const data = await response.json();
      setGenreMovies(data.results || []);
    } catch (error) {
      setSearchError('Failed to fetch movies. Please try again.');
      setGenreMovies([]);
      console.error('Genre fetch error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHomeClick = async () => {
    // Reset to home state
    setActiveTab('search');
    setSearchResults([]);
    setHasSearched(false);
    setSelectedGenreId(null);
    setSelectedGenreName('Top 20 Popular Movies');
    setSearchError(null);
    handleCloseModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reload popular movies
    setIsSearching(true);
    try {
      const response = await fetch('/api/discover?popular=true');
      if (response.ok) {
        const data = await response.json();
        setGenreMovies(data.results || []);
      }
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-amber-500/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-200"
              aria-label="Go to home"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-shadow">
                  <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:via-amber-400 group-hover:to-amber-500 transition-all">
                  Movie Explorer
                </h1>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Discover your next favorite film</p>
              </div>
            </button>
            
            {/* Tab Switcher */}
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-1.5 border border-slate-700/50 shadow-xl">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'search'
                      ? 'text-slate-900 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeTab === 'search' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg"></div>
                  )}
                  <span className="relative flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'favorites'
                      ? 'text-slate-900 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeTab === 'favorites' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg"></div>
                  )}
                  <span className="relative flex items-center gap-2">
                    <svg className="w-4 h-4" fill={activeTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Favorites
                    {isLoaded && favorites.length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                        activeTab === 'favorites'
                          ? 'bg-slate-900 text-amber-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {favorites.length}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'search' ? (
          <div className="space-y-10">
            {/* Search Bar */}
            <div className="animate-fade-in">
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>

            {/* Genre Filter */}
            <div className="animate-fade-in">
              <GenreFilter
                onGenreSelect={handleGenreSelect}
                selectedGenreId={selectedGenreId}
              />
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="max-w-3xl mx-auto animate-shake">
                <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-200 px-6 py-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{searchError}</span>
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {hasSearched && !isSearching && searchResults.length === 0 && !searchError && (
              <div className="text-center py-20 animate-fade-in">
                <div className="inline-block p-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                  <svg className="w-24 h-24 text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-2xl font-semibold text-slate-300 mb-3">No movies found</h3>
                  <p className="text-slate-500 max-w-md">Try searching with a different title or explore popular movies</p>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                    Search Results
                    <span className="text-lg text-slate-500 font-normal">({searchResults.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <MovieCard
                        movie={movie}
                        onViewDetails={handleViewDetails}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={isFavorite(movie.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Genre Movies */}
            {genreMovies.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                    {selectedGenreId === null ? selectedGenreName : `${selectedGenreName} Movies`}
                    <span className="text-lg text-slate-500 font-normal">({genreMovies.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {genreMovies.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <MovieCard
                        movie={movie}
                        onViewDetails={handleViewDetails}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={isFavorite(movie.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                My Favorites
                {isLoaded && favorites.length > 0 && (
                  <span className="text-lg text-slate-500 font-normal">({favorites.length})</span>
                )}
              </h2>
            </div>
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={removeFavorite}
              onUpdateFavorite={updateFavorite}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite(selectedMovie.id)}
        />
      )}

      {/* Rating Modal */}
      {movieToRate && (
        <RatingModal
          movieTitle={movieToRate.title}
          onSubmit={handleRatingSubmit}
          onCancel={handleRatingCancel}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-full shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-110 transition-all duration-300 animate-scale-in"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}