import { useState, useEffect } from 'react';
import { FavoriteMovie } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load on mount (Client-side only)
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save on change
  const addFavorite = (movie: FavoriteMovie) => {
    const updated = [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeFavorite = (id: number) => {
    const updated = favorites.filter(m => m.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const updateFavorite = (id: number, updates: Partial<FavoriteMovie>) => {
    const updated = favorites.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (id: number) => {
    return favorites.some(m => m.id === id);
  };

  return { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    updateFavorite, 
    isFavorite,
    isLoaded 
  };
}
