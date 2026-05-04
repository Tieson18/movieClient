import { useState } from "react";
import { AddMovieForm } from "../components/AddMovieForm";
import { MovieList } from "../components/MovieList";
import { MovieStats } from "../components/MovieStats";
import { UpdateMovieForm } from "../components/UpdateMovieForm";
import { useAuth } from "../context/AuthContext";
import type { MovieDetails } from "../types";

export function MoviePage() {
  const { role } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const isAdmin = role === "admin";

  return (
    <main className="flex h-[calc(100vh-97px)] flex-col overflow-hidden md:flex-row">
      <aside className="w-full shrink-0 border-b border-slate-800 bg-slate-950/95 p-4 md:h-full md:w-md md:overflow-y-auto md:border-b-0 md:border-r scroll-hide">
        <div className="space-y-6">
          {isAdmin ? <AddMovieForm /> : null}
          <MovieStats />
        </div>
      </aside>

      <section className="min-h-0 flex-1 overflow-y-auto bg-slate-950 px-4 py-6 sm:px-6 lg:px-8 scroll-hide">
        <div className="space-y-6">
          <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Movie catalog</h1>
              <p className="mt-1 text-sm text-slate-400">
                Browse the collection and open any title for reviews, details, and watchlist actions.
              </p>
            </div>

            <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              {isAdmin ? "Admin View" : "User View"}
            </div>
          </div>

          <MovieList role={role} onMovieEdit={isAdmin ? setSelectedMovie : undefined} />
        </div>
      </section>

      {isAdmin ? <UpdateMovieForm movie={selectedMovie} onCancel={() => setSelectedMovie(null)} /> : null}
    </main>
  );
}
