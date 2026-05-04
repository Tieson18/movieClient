import { useState } from "react";
import { useDeleteMovie, useMovies } from "../hooks/useMovies";
import { MovieCard } from "./MovieCard";
import type { MovieDetails, UserRole } from "../types";

interface MovieListProps {
  role: UserRole | null;
  onMovieEdit?: (movie: MovieDetails) => void;
}

export function MovieList({ role, onMovieEdit }: MovieListProps) {
  const { data: movies = [], isLoading, error } = useMovies();
  const deleteMovie = useDeleteMovie();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isAdmin = role === "admin";

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteMovie.mutateAsync(id);
    } catch (err) {
      console.error("Error deleting movie", err);
      const message = err instanceof Error ? err.message : "Failed to delete movie";
      window.alert(`Error deleting movie: ${message}`);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300">
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
        Failed to fetch movies.
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300">
        No movies found. Add one to get started.
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{ ...movie, externalData: movie.externalData ?? null }}
            footer={
              isAdmin && onMovieEdit ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:scale-105 hover:border-slate-600 hover:bg-slate-800"
                    onClick={() => onMovieEdit({ ...movie, externalData: movie.externalData ?? null })}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-rose-500/40 px-3 py-2 text-sm font-medium text-rose-200 transition hover:scale-105 hover:bg-rose-500/10"
                    onClick={() => handleDelete(movie.id)}
                    disabled={deletingId === movie.id}
                  >
                    {deletingId === movie.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : null
            }
          />
        ))}
      </div>
    </section>
  );
}
