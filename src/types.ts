export type UserRole = "user" | "admin";

export interface Movie {
  id: string;
  title: string;
  director: string;
  releaseYear: number | null;
  genre: string;
  rating: number;
  externalData?: ExternalMovieData | null;
}

export interface ExternalMovieData {
  overview: string | null;
  posterPath: string | null;
  popularity: number | null;
  releaseDate: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  originalTitle: string | null;
}

export interface MovieDetails extends Movie {
  externalData: ExternalMovieData | null;
}

export interface MovieCreate {
  title: string;
  director: string;
  releaseYear: number | null;
  genre: string;
  rating: number;
}

export interface MovieUpdate {
  title?: string;
  director?: string;
  releaseYear?: number | null;
  genre?: string;
  rating?: number;
}

export type Genre = "Action" | "Drama" | "Comedy" | "Sci-Fi";

export interface Stats {
  totalMovies: number;
  averageRating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string | null;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  role: UserRole;
  user: User;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string | null;
}

export interface ReviewCreate {
  movieId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie | null;
  createdAt: string | null;
}

export interface WatchlistCreate {
  userId: string;
  movieId: string;
}
