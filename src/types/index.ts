export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  overview: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
  tagline?: string;
  budget?: number;
  revenue?: number;
  genres?: { id: number; name: string }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface FavoriteMovie extends Movie {
  personalRating?: number;
  personalNote?: string;
  favoritedAt: number;
}
