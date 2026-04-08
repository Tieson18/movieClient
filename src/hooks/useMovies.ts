import { useQuery } from "@tanstack/react-query";
import { getClient } from "../api/client";
import type { Movie, Genre } from "../types";

const fetchMovies = async (): Promise<Movie[]> => {
  const client = getClient();
  const response = await client.movies.get();

  if (!response) return [];

  const apiMovies = response.value ?? [];

  return apiMovies.map((movie) => ({
    id: movie.id ?? "",
    title: movie.title ?? "",
    director: movie.director ?? "",
    releaseYear: Number(movie.additionalData?.release_year) || 0,
    genre: (movie.genre ?? "Drama") as Genre,
    rating: movie.rating ?? 0,
  }));
};

export function useMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}
