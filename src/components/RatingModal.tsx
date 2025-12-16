'use client';

import { useState } from 'react';

interface RatingModalProps {
  movieTitle: string;
  onSubmit: (rating?: number, note?: string) => void;
  onCancel: () => void;
}

export default function RatingModal({ movieTitle, onSubmit, onCancel }: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [personalNote, setPersonalNote] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(selectedRating, personalNote || undefined);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-amber-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Add to Favorites
            </h3>
          </div>
          <p className="text-slate-400 text-sm line-clamp-2 pl-14">{movieTitle}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Your Rating (optional)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? undefined : rating)}
                  className={`p-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    selectedRating === rating
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/30 scale-105'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-amber-400 border border-slate-700/50 hover:border-amber-500/30'
                  }`}
                >
                  {rating}⭐
                </button>
              ))}
            </div>
            {selectedRating && (
              <p className="mt-3 text-center text-amber-400 text-sm font-medium animate-fade-in">
                You selected: {selectedRating} star{selectedRating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Personal Notes (optional)
            </label>
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Add your thoughts, memories, or why you love this movie..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
            />
            <p className="mt-2 text-xs text-slate-500">
              Share what made this movie special to you
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all font-medium border border-slate-700/50 hover:border-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
          >
            Add to Favorites
          </button>
        </div>
      </div>
    </div>
  );
}
