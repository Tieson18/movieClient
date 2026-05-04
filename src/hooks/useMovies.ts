import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMovie,
  deleteMovie,
  fetchMovie,
  fetchMovieDetails,
  fetchMovies,
  updateMovie,
} from "../api/queries";
import type { Movie, MovieCreate, MovieDetails, MovieUpdate } from "../types";

export const movieKeys = {
  all: ["movies"] as const,
  detail: (id: string) => ["movies", id] as const,
  details: (id: string) => ["movies", id, "details"] as const,
  stats: ["movieStats"] as const,
};

export function useMovies() {
  return useQuery({
    queryKey: movieKeys.all,
    queryFn: fetchMovies,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMovie(id: string | null | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: movieKeys.detail(id ?? ""),
    queryFn: () => fetchMovie(id ?? ""),
    enabled: Boolean(id),
    initialData: () => {
      if (!id) {
        return null;
      }

      const cachedDetails = queryClient.getQueryData<MovieDetails | null>(movieKeys.details(id));
      if (cachedDetails) {
        return cachedDetails;
      }

      const cachedMovies = queryClient.getQueryData<Movie[]>(movieKeys.all);
      return cachedMovies?.find((movie) => movie.id === id) ?? null;
    },
  });
}

export function useMovieDetails(id: string | null | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: movieKeys.details(id ?? ""),
    queryFn: () => fetchMovieDetails(id ?? ""),
    enabled: Boolean(id),
    initialData: () => {
      if (!id) {
        return null;
      }

      const cachedMovie = queryClient.getQueryData<Movie[]>(movieKeys.all)?.find((movie) => movie.id === id);
      if (!cachedMovie) {
        return null;
      }

      return {
        ...cachedMovie,
        externalData: cachedMovie.externalData ?? null,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MovieCreate) => createMovie(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: movieKeys.all });
      await queryClient.invalidateQueries({ queryKey: movieKeys.stats });
    },
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MovieUpdate }) => updateMovie(id, payload),
    onSuccess: async (movie) => {
      await queryClient.invalidateQueries({ queryKey: movieKeys.all });
      await queryClient.invalidateQueries({ queryKey: movieKeys.detail(movie.id) });
      await queryClient.invalidateQueries({ queryKey: movieKeys.details(movie.id) });
      await queryClient.invalidateQueries({ queryKey: movieKeys.stats });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: movieKeys.all });
      await queryClient.invalidateQueries({ queryKey: movieKeys.stats });
      await queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
