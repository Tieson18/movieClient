import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWatchlist, fetchWatchlist, removeFromWatchlist } from "../api/queries";
import type { WatchlistCreate } from "../types";

export const watchlistKeys = {
  all: ["watchlist"] as const,
  byUser: (userId: string) => ["watchlist", userId] as const,
};

export function useWatchlist(userId: string | null | undefined) {
  return useQuery({
    queryKey: watchlistKeys.byUser(userId ?? ""),
    queryFn: () => fetchWatchlist(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WatchlistCreate) => addToWatchlist(payload),
    onSuccess: async (_item, payload) => {
      await queryClient.invalidateQueries({ queryKey: watchlistKeys.byUser(payload.userId) });
    },
  });
}

export function useRemoveFromWatchlist(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (watchlistId: string) => removeFromWatchlist(watchlistId),
    onSuccess: async () => {
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: watchlistKeys.byUser(userId) });
      }
    },
  });
}
