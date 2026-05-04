import { Link } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { useRemoveFromWatchlist, useWatchlist } from "../hooks/useWatchlist";

export function WatchlistPage() {
  const { userId } = useAuth();
  const { data: watchlist = [], isLoading, error } = useWatchlist(userId);
  const removeFromWatchlist = useRemoveFromWatchlist(userId);

  async function handleRemove(id: string) {
    try {
      await removeFromWatchlist.mutateAsync(id);
    } catch (removeError) {
      console.error("Failed to remove watchlist item", removeError);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Watchlist</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Saved movies</h2>
          <p className="mt-2 text-sm text-slate-400">Everything you have bookmarked for later.</p>
        </div>
      </section>

      {error ? (
        <div className="mb-6">
          <StatusMessage kind="error">Unable to load watchlist.</StatusMessage>
        </div>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">My Watchlist</h3>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
            {watchlist.length}
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300">
            Loading watchlist...
          </div>
        ) : watchlist.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300">
            No saved movies yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {watchlist.map((item) =>
              item.movie ? (
                <MovieCard
                  key={item.id}
                  movie={{ ...item.movie, externalData: item.movie.externalData ?? null }}
                  footer={
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={`/movies/${item.movie.id}`}
                        className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
                      >
                        View details
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleRemove(item.id)}
                        disabled={removeFromWatchlist.isPending && removeFromWatchlist.variables === item.id}
                      >
                        {removeFromWatchlist.isPending && removeFromWatchlist.variables === item.id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  }
                />
              ) : null,
            )}
          </div>
        )}
      </section>
    </main>
  );
}
