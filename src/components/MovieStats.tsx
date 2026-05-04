import { useMovieStats } from "../hooks/useMovieStats";

export function MovieStats() {
  const { data: stats, isLoading, error } = useMovieStats();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-sm text-slate-300">
        Loading stats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">
        Failed to fetch stats.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-black/20">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Statistics</h2>
        <p className="text-sm text-slate-400">A quick pulse on the catalog.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-3xl font-semibold text-white">{stats?.totalMovies ?? 0}</div>
          <div className="mt-1 text-sm text-slate-400">Total movies</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-3xl font-semibold text-white">
            {typeof stats?.averageRating === "number" ? stats.averageRating.toFixed(1) : "N/A"}
          </div>
          <div className="mt-1 text-sm text-slate-400">Average rating</div>
        </div>
      </div>
    </section>
  );
}
