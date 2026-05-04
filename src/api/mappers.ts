import type {
  AuthResponse as ApiAuthResponse,
  Movie as ApiMovie,
  MovieStats as ApiMovieStats,
  MovieWithDetails as ApiMovieWithDetails,
  Review as ApiReview,
  User as ApiUser,
  User_role,
  WatchlistItem as ApiWatchlistItem,
} from "./client/models/index.js";
import type { AuthResponse, ExternalMovieData, Movie, MovieDetails, Review, Stats, User, UserRole, WatchlistItem } from "../types";

const toIsoString = (value: Date | string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
};

const readAdditional = (
  input: { additionalData?: Record<string, unknown> | null } | null | undefined,
  key: string,
) => input?.additionalData?.[key];

const readString = (input: unknown): string | null =>
  typeof input === "string" && input.trim().length > 0 ? input : null;

const readNumber = (input: unknown): number | null =>
  typeof input === "number" && !Number.isNaN(input) ? input : null;

const readRole = (role: ApiUser["role"] | unknown): UserRole =>
  role === "admin" ? "admin" : "user";

export const mapMovie = (apiMovie: ApiMovie | ApiMovieWithDetails | null | undefined): Movie | null => {
  if (!apiMovie) {
    return null;
  }

  const id = readString(apiMovie.id ?? readAdditional(apiMovie, "id"));
  const title = readString(apiMovie.title ?? readAdditional(apiMovie, "title"));

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    director: readString(apiMovie.director ?? readAdditional(apiMovie, "director")) ?? "",
    genre: readString(apiMovie.genre ?? readAdditional(apiMovie, "genre")) ?? "Unknown",
    rating: readNumber(apiMovie.rating ?? readAdditional(apiMovie, "rating")) ?? 0,
    releaseYear:
      readNumber(
        apiMovie.releaseYear ??
          readAdditional(apiMovie, "releaseYear") ??
          readAdditional(apiMovie, "release_year"),
      ) ?? null,
    externalData: "externalData" in apiMovie ? mapExternalMovieData(apiMovie as ApiMovieWithDetails) : null,
  };
};

const mapExternalMovieData = (apiMovie: ApiMovieWithDetails | null | undefined): ExternalMovieData | null => {
  const external = apiMovie?.externalData;
  const data = external?.additionalData ?? null;

  if (!data) {
    return null;
  }

  return {
    overview: readString(data.overview),
    posterPath: readString(data.poster_path),
    popularity: readNumber(data.popularity),
    releaseDate: readString(data.release_date),
    voteAverage: readNumber(data.vote_average),
    voteCount: readNumber(data.vote_count),
    originalTitle: readString(data.original_title),
  };
};

export const mapMovieDetails = (apiMovie: ApiMovieWithDetails | null | undefined): MovieDetails | null => {
  const movie = mapMovie(apiMovie);

  if (!movie) {
    return null;
  }

  return {
    ...movie,
    externalData: mapExternalMovieData(apiMovie),
  };
};

export const mapUser = (apiUser: ApiUser | null | undefined): User | null => {
  if (!apiUser) {
    return null;
  }

  const id = readString(apiUser.id ?? readAdditional(apiUser, "id"));
  const name = readString(apiUser.name ?? readAdditional(apiUser, "name"));
  const email = readString(apiUser.email ?? readAdditional(apiUser, "email"));

  if (!id || !name || !email) {
    return null;
  }

  return {
    id,
    name,
    email,
    role: readRole((apiUser.role as User_role | null | undefined) ?? readAdditional(apiUser, "role")),
    createdAt: toIsoString(
      apiUser.createdAt ?? (readAdditional(apiUser, "createdAt") as string | undefined) ?? null,
    ),
  };
};

export const mapAuthResponse = (apiAuthResponse: ApiAuthResponse | null | undefined): AuthResponse | null => {
  if (!apiAuthResponse) {
    return null;
  }

  const token = readString(apiAuthResponse.token);
  const user = mapUser(apiAuthResponse.user);

  if (!token || !user) {
    return null;
  }

  return {
    token,
    user,
  };
};

export const mapReview = (
  apiReview: ApiReview | null | undefined,
  userName = "Unknown user",
): Review | null => {
  if (!apiReview) {
    return null;
  }

  const id = readString(apiReview.id ?? readAdditional(apiReview, "id"));
  const movieId = readString(apiReview.movieId ?? readAdditional(apiReview, "movieId"));
  const userId = readString(apiReview.userId ?? readAdditional(apiReview, "userId"));

  if (!id || !movieId || !userId) {
    return null;
  }

  return {
    id,
    movieId,
    userId,
    userName,
    rating: readNumber(apiReview.rating ?? readAdditional(apiReview, "rating")) ?? 0,
    comment: readString(apiReview.comment ?? readAdditional(apiReview, "comment")) ?? "",
    createdAt: toIsoString(
      apiReview.createdAt ?? (readAdditional(apiReview, "createdAt") as string | undefined) ?? null,
    ),
  };
};

export const mapWatchlistItem = (
  apiItem: ApiWatchlistItem | null | undefined,
  movie: Movie | null,
): WatchlistItem | null => {
  if (!apiItem) {
    return null;
  }

  const id = readString(apiItem.id ?? readAdditional(apiItem, "id"));
  const movieId = readString(apiItem.movieId ?? readAdditional(apiItem, "movieId"));
  const userId = readString(apiItem.userId ?? readAdditional(apiItem, "userId"));

  if (!id || !movieId || !userId) {
    return null;
  }

  return {
    id,
    movieId,
    userId,
    movie,
    createdAt: toIsoString(
      apiItem.createdAt ?? (readAdditional(apiItem, "createdAt") as string | undefined) ?? null,
    ),
  };
};

export const mapStats = (apiStats: ApiMovieStats | null | undefined): Stats => ({
  totalMovies: readNumber(apiStats?.totalMovies ?? readAdditional(apiStats, "totalMovies")) ?? 0,
  averageRating: readNumber(apiStats?.averageRating ?? readAdditional(apiStats, "averageRating")) ?? 0,
});
