import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAddToWatchlist, useRemoveFromWatchlist, useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types";

interface WatchlistButtonProps {
  movie: Movie | null;
}

export function WatchlistButton({ movie }: WatchlistButtonProps) {
  const { userId } = useAuth();
  const { data: watchlist = [], isLoading } = useWatchlist(userId);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist(userId);

  const currentItem = useMemo(
    () => watchlist.find((item) => item.movieId === movie?.id) ?? null,
    [movie?.id, watchlist],
  );

  if (!movie || !userId) {
    return null;
  }
  const currentMovie = movie;
  const currentUserId = userId;

  async function handleClick() {
    try {
      if (currentItem) {
        await removeFromWatchlist.mutateAsync(currentItem.id);
        return;
      }

      await addToWatchlist.mutateAsync({ userId: currentUserId, movieId: currentMovie.id });
    } catch (error) {
      console.error("Failed to update watchlist", error);
    }
  }

  const isBusy =
    isLoading ||
    addToWatchlist.isPending ||
    (removeFromWatchlist.isPending && removeFromWatchlist.variables === currentItem?.id);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleClick}
      disabled={isBusy}
    >
      {isBusy ? "Saving..." : currentItem ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
}
