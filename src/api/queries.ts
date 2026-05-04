import { getClient } from "./client";
import { toError } from "./errors";
import { mapAuthResponse, mapMovie, mapMovieDetails, mapReview, mapStats, mapUser, mapWatchlistItem } from "./mappers";
import type {
  AuthResponse,
  LoginCredentials,
  Movie,
  MovieCreate,
  MovieDetails,
  MovieUpdate,
  RegisterCredentials,
  Review,
  ReviewCreate,
  Stats,
  User,
  WatchlistCreate,
  WatchlistItem,
} from "../types";

const client = () => getClient();

const throwMappedError = (error: unknown, fallback: string): never => {
  console.error(fallback, error);
  throw toError(error, fallback);
};

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await client().movies.get();
    return (response?.value ?? []).map(mapMovie).filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    return throwMappedError(error, "Unable to load movies.");
  }
};

export const fetchMovie = async (id: string): Promise<Movie | null> => {
  try {
    if (!id) {
      return null;
    }

    const response = await client().movies.byId(id).get();
    return mapMovie(response);
  } catch (error) {
    return throwMappedError(error, "Unable to load the selected movie.");
  }
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails | null> => {
  try {
    if (!id) {
      return null;
    }

    const response = await client().movies.byId(id).details.get();
    return mapMovieDetails(response);
  } catch (error) {
    return throwMappedError(error, "Unable to load movie details.");
  }
};

export const fetchMovieStats = async (): Promise<Stats> => {
  try {
    const response = await client().movies.stats.get();
    return mapStats(response);
  } catch (error) {
    return throwMappedError(error, "Unable to load movie stats.");
  }
};

export const createMovie = async (payload: MovieCreate): Promise<Movie> => {
  try {
    const response = await client().movies.post(payload);
    const movie = mapMovie(response);

    if (!movie) {
      throw new Error("Movie response was empty.");
    }

    return movie;
  } catch (error) {
    return throwMappedError(error, "Unable to create movie.");
  }
};

export const updateMovie = async (id: string, payload: MovieUpdate): Promise<Movie> => {
  try {
    const response = await client().movies.byId(id).patch(payload);
    const movie = mapMovie(response);

    if (!movie) {
      throw new Error("Movie response was empty.");
    }

    return movie;
  } catch (error) {
    return throwMappedError(error, "Unable to update movie.");
  }
};

export const deleteMovie = async (id: string): Promise<void> => {
  try {
    await client().movies.byId(id).delete();
  } catch (error) {
    return throwMappedError(error, "Unable to delete movie.");
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await client().users.get();
    return (response?.value ?? []).map(mapUser).filter((user): user is User => user !== null);
  } catch (error) {
    return throwMappedError(error, "Unable to load users.");
  }
};

export const fetchUser = async (id: string): Promise<User | null> => {
  try {
    if (!id) {
      return null;
    }

    const response = await client().users.byId(id).get();
    return mapUser(response);
  } catch (error) {
    return throwMappedError(error, "Unable to load user profile.");
  }
};

export const registerUser = async (payload: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await client().auth.register.post(payload);
    const authResponse = mapAuthResponse(response);

    if (!authResponse) {
      throw new Error("Authentication response was empty.");
    }

    return authResponse;
  } catch (error) {
    return throwMappedError(error, "Unable to sign up.");
  }
};

export const loginUser = async (payload: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await client().auth.login.post(payload);
    const authResponse = mapAuthResponse(response);

    if (!authResponse) {
      throw new Error("Authentication response was empty.");
    }

    return authResponse;
  } catch (error) {
    return throwMappedError(error, "Unable to log in.");
  }
};

export const fetchReviews = async (movieId: string): Promise<Review[]> => {
  try {
    if (!movieId) {
      return [];
    }

    const reviewResponse = await client().movies.byId(movieId).reviews.get();
    const reviewItems = (reviewResponse?.value ?? []).filter((review) => review != null);
    const uniqueUserIds = [...new Set(reviewItems.map((review) => String(review.userId ?? "")).filter(Boolean))];
    const users = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          return await fetchUser(userId);
        } catch (error) {
          console.error("Unable to load review user", error);
          return null;
        }
      }),
    );
    const usersById = new Map(users.filter((user): user is User => user !== null).map((user) => [user.id, user.name]));

    return reviewItems
      .map((review) => mapReview(review, usersById.get(String(review?.userId ?? "")) ?? "Unknown user"))
      .filter((review): review is Review => review !== null);
  } catch (error) {
    return throwMappedError(error, "Unable to load reviews.");
  }
};

export const addReview = async (payload: ReviewCreate): Promise<Review> => {
  try {
    const [response, user] = await Promise.all([
      client().reviews.post(payload),
      fetchUser(payload.userId).catch((error) => {
        console.error("Unable to load review user", error);
        return null;
      }),
    ]);
    const userName = user?.name ?? "Unknown user";
    const review = mapReview(response, userName);

    if (!review) {
      throw new Error("Review response was empty.");
    }

    return review;
  } catch (error) {
    return throwMappedError(error, "Unable to add review.");
  }
};

export const fetchWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  try {
    if (!userId) {
      return [];
    }

    const [response, movies] = await Promise.all([
      client().users.byId(userId).watchlist.get(),
      fetchMovies(),
    ]);
    const moviesById = new Map(movies.map((movie) => [movie.id, movie]));

    return (response?.value ?? [])
      .map((item) => mapWatchlistItem(item, moviesById.get(String(item?.movieId ?? "")) ?? null))
      .filter((item): item is WatchlistItem => item !== null);
  } catch (error) {
    return throwMappedError(error, "Unable to load watchlist.");
  }
};

export const addToWatchlist = async (payload: WatchlistCreate): Promise<WatchlistItem> => {
  try {
    const response = await client().watchlist.post(payload);
    const movie = await fetchMovie(payload.movieId);
    const item = mapWatchlistItem(response, movie);

    if (!item) {
      throw new Error("Watchlist response was empty.");
    }

    return item;
  } catch (error) {
    return throwMappedError(error, "Unable to add movie to watchlist.");
  }
};

export const removeFromWatchlist = async (id: string): Promise<void> => {
  try {
    await client().watchlist.byId(id).delete();
  } catch (error) {
    return throwMappedError(error, "Unable to remove movie from watchlist.");
  }
};
