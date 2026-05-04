import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { MovieDetails } from "../types";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: MovieDetails;
  footer?: ReactNode;
}

export function MovieCard({ movie, footer }: MovieCardProps) {
  const posterUrl = movie.externalData?.posterPath ? `${POSTER_BASE_URL}${movie.externalData.posterPath}` : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md shadow-black/20 transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:border-slate-700">
      <Link to={`/movies/${movie.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
        <div className="aspect-[2/3] w-full overflow-hidden bg-slate-800">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <h3 className="line-clamp-1 text-base font-semibold text-white">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>{movie.genre}</span>
              <span className="text-slate-600">|</span>
              <span>{movie.releaseYear ?? "Unknown year"}</span>
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-300">
            {movie.externalData?.overview ?? `${movie.director} directed this title.`}
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="rounded-full bg-sky-500/10 px-2.5 py-1 font-medium text-sky-200">
              {movie.rating.toFixed(1)}/10
            </span>
            <span className="truncate text-slate-500">{movie.director}</span>
          </div>
        </div>
      </Link>

      {footer ? <div className="border-t border-slate-800 px-4 py-3">{footer}</div> : null}
    </article>
  );
}
