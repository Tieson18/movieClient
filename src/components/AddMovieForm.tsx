import { useState } from "react";
import { useCreateMovie } from "../hooks/useMovies";
import type { Genre, MovieCreate } from "../types";

const GENRES: Genre[] = ["Action", "Drama", "Comedy", "Sci-Fi"];

export function AddMovieForm() {
  const createMovie = useCreateMovie();
  const [formData, setFormData] = useState<MovieCreate>({
    title: "",
    director: "",
    releaseYear: new Date().getFullYear(),
    genre: "Drama",
    rating: 7.5,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "releaseYear" || name === "rating" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title.trim() || !formData.director.trim()) {
      setError("Title and director are required.");
      return;
    }

    try {
      await createMovie.mutateAsync(formData);
      setSuccess(true);
      setFormData({
        title: "",
        director: "",
        releaseYear: new Date().getFullYear(),
        genre: "Drama",
        rating: 7.5,
      });
    } catch (err) {
      console.error("Failed to add movie", err);
      const message = err instanceof Error ? err.message : "Failed to add movie.";
      setError(message);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-black/20">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Add new movie</h2>
        <p className="text-sm text-slate-400">Create a new catalog entry.</p>
      </div>

      {error ? (
        <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Movie added successfully.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="director" className="block text-sm font-medium text-slate-300">
            Director *
          </label>
          <input
            id="director"
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="releaseYear" className="block text-sm font-medium text-slate-300">
              Release Year
            </label>
            <input
              id="releaseYear"
              type="number"
              name="releaseYear"
              value={formData.releaseYear ?? ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="genre" className="block text-sm font-medium text-slate-300">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rating" className="block text-sm font-medium text-slate-300">
              Rating
            </label>
            <input
              id="rating"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={createMovie.isPending}
        >
          {createMovie.isPending ? "Adding..." : "Add Movie"}
        </button>
      </form>
    </section>
  );
}
