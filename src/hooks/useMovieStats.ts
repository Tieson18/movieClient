import { useQuery } from "@tanstack/react-query";
import { fetchMovieStats } from "../api/queries";
import { movieKeys } from "./useMovies";

export function useMovieStats() {
  return useQuery({
    queryKey: movieKeys.stats,
    queryFn: fetchMovieStats,
    staleTime: 1000 * 60,
  });
}
