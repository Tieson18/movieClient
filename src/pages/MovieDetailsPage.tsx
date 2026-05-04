import { Link, useParams } from "react-router-dom";
import { ReviewForm } from "../components/ReviewForm";
import { StatusMessage } from "../components/StatusMessage";
import { WatchlistButton } from "../components/WatchlistButton";
import { useMovieDetails } from "../hooks/useMovies";
import { useReviews } from "../hooks/useReviews";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading: isMovieLoading, error: movieError } = useMovieDetails(id);
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useReviews(id);

  if (isMovieLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300">
          Loading movie details...
        </div>
      </main>
    );
  }

  if (movieError || !movie) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage kind="error">Unable to load movie details.</StatusMessage>
      </main>
    );
  }

  const posterUrl = movie.externalData?.posterPath ? `${POSTER_BASE_URL}${movie.externalData.posterPath}` : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Movie Details</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{movie.title}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span>{movie.genre}</span>
            <span className="text-slate-600">|</span>
            <span>{movie.rating.toFixed(1)}/10</span>
            <span className="text-slate-600">|</span>
            <span>{movie.releaseYear ?? "Year unknown"}</span>
          </div>
        </div>

        <Link
          to="/movies"
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          Back to Movies
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
          <div className="aspect-[2/3] bg-slate-800">
            {posterUrl ? (
              <img src={posterUrl} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
                No poster available
              </div>
            )}
          </div>

          <div className="space-y-4 p-5">
            <WatchlistButton movie={movie} />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Popularity</div>
                <div className="mt-1 font-medium text-white">{movie.externalData?.popularity ?? "N/A"}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Vote Average</div>
                <div className="mt-1 font-medium text-white">{movie.externalData?.voteAverage ?? "N/A"}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Vote Count</div>
                <div className="mt-1 font-medium text-white">{movie.externalData?.voteCount ?? "N/A"}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Original Title</div>
                <div className="mt-1 font-medium text-white">{movie.externalData?.originalTitle ?? movie.title}</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">Overview</h3>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-400">
                {movie.externalData?.releaseDate ?? "Release date unavailable"}
              </span>
            </div>
            <p className="text-sm leading-7 text-slate-300">
              {movie.externalData?.overview ?? "No overview available for this movie."}
            </p>
          </article>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">Reviews</h3>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-400">
                {reviews.length}
              </span>
            </div>

            {reviewsError ? (
              <div className="mb-4">
                <StatusMessage kind="error">Unable to load reviews.</StatusMessage>
              </div>
            ) : null}

            <div className="h-64 space-y-3 overflow-y-auto pr-1">
              {isReviewsLoading ? (
                <p className="text-sm text-slate-300">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-slate-400">No reviews for this movie yet.</p>
              ) : (
                reviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <strong className="text-sm font-semibold text-white">{review.userName}</strong>
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-200">
                        {review.rating}/10
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{review.comment}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>

      <footer className="sticky bottom-0 mt-8 border-t border-slate-800 bg-slate-950/90 py-4 backdrop-blur">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">Add Review</h3>
            <span className="text-xs uppercase tracking-wide text-slate-500">Quick post</span>
          </div>
          <ReviewForm movieId={movie.id} onCreated={() => void refetchReviews()} />
        </div>
      </footer>
    </main>
  );
}
