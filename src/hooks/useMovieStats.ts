import { useQuery } from "@tanstack/react-query";
import { getClient } from "../api/client";
import type { Stats } from "../types";

const fetchStats = async (): Promise<Stats | null> => {
  const client = getClient();

  const response = await client.movies.stats.get();

  if (!response) return null;

  return response as Stats;
};

export function useMovieStats() {
  return useQuery({
    queryKey: ["movieStats"],
    queryFn: fetchStats,
    staleTime: 0, // 🔥 longer cache (10 mins)
  });
}
