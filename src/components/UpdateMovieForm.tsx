import { useEffect, useState } from "react";
import { useUpdateMovie } from "../hooks/useMovies";
import type { Genre, Movie, MovieUpdate } from "../types";

const GENRES: Genre[] = ["Action", "Drama", "Comedy", "Sci-Fi"];

interface UpdateMovieFormProps {
  movie: Movie | null;
  onCancel: () => void;
}

export function UpdateMovieForm({ movie, onCancel }: UpdateMovieFormProps) {
  const updateMovie = useUpdateMovie();
  const [formData, setFormData] = useState<MovieUpdate>(
    movie
      ? {
          title: movie.title,
          director: movie.director,
          releaseYear: movie.releaseYear,
          genre: movie.genre,
          rating: movie.rating,
        }
      : {},
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!movie) {
      return;
    }

    setFormData({
      title: movie.title,
      director: movie.director,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
      rating: movie.rating,
    });
    setError(null);
    setSuccess(false);
  }, [movie]);

  if (!movie) {
    return null;
  }
  const currentMovie = movie;

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "releaseYear" || name === "rating" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.title !== undefined && !formData.title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    if (formData.director !== undefined && !formData.director.trim()) {
      setError("Director cannot be empty");
      return;
    }

    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 10)) {
      setError("Rating must be between 0 and 10");
      return;
    }

    try {
      await updateMovie.mutateAsync({ id: currentMovie.id, payload: formData });
      setSuccess(true);
      window.setTimeout(onCancel, 1500);
    } catch (err) {
      console.error("Error updating movie", err);
      const message = err instanceof Error ? err.message : "Failed to update movie";
      setError(`Failed to update movie: ${message}`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Update Movie</h2>
            <p className="text-sm text-slate-400">Edit catalog information for {currentMovie.title}.</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
            onClick={onCancel}
          >
            Close
          </button>
        </div>

        {error ? (
          <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Movie updated successfully.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="update-title" className="block text-sm font-medium text-slate-300">
              Title
            </label>
            <input
              id="update-title"
              type="text"
              name="title"
              value={formData.title ?? ""}
              onChange={handleChange}
              placeholder="Enter movie title"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="update-director" className="block text-sm font-medium text-slate-300">
              Director
            </label>
            <input
              id="update-director"
              type="text"
              name="director"
              value={formData.director ?? ""}
              onChange={handleChange}
              placeholder="Enter director name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label htmlFor="update-releaseYear" className="block text-sm font-medium text-slate-300">
                Release Year
              </label>
              <input
                id="update-releaseYear"
                type="number"
                name="releaseYear"
                value={formData.releaseYear ?? ""}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="update-genre" className="block text-sm font-medium text-slate-300">
                Genre
              </label>
              <select
                id="update-genre"
                name="genre"
                value={formData.genre ?? ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              >
                <option value="">Select a genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="update-rating" className="block text-sm font-medium text-slate-300">
                Rating
              </label>
              <input
                id="update-rating"
                type="number"
                name="rating"
                value={formData.rating ?? ""}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={updateMovie.isPending}
            >
              {updateMovie.isPending ? "Updating..." : "Update Movie"}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onCancel}
              disabled={updateMovie.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
