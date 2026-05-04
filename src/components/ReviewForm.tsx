import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAddReview } from "../hooks/useReviews";

interface ReviewFormProps {
  movieId: string | null;
  onCreated?: () => void;
}

export function ReviewForm({ movieId, onCreated }: ReviewFormProps) {
  const { userId } = useAuth();
  const addReview = useAddReview();
  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!movieId || !userId) {
      setError("You need to be signed in and viewing a movie to post a review.");
      return;
    }

    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }

    try {
      await addReview.mutateAsync({
        movieId,
        userId,
        rating,
        comment: comment.trim(),
      });
      setRating(8);
      setComment("");
      onCreated?.();
    } catch (err) {
      console.error("Failed to add review", err);
      setError(err instanceof Error ? err.message : "Failed to add review.");
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="flex  flex-col justify-center gap-2 sm:flex-row sm:items-center">
        <div className="w-full sm:w-20 pb-1.5">
          <label
            htmlFor="review-rating"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Rating
          </label>
          <input
            id="review-rating"
            name="rating"
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor="review-comment"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Comment
          </label>
          <textarea
            id="review-comment"
            name="comment"
            rows={1}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
            className="h-11 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
          />
        </div>

        <div className=" pt-3">
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            disabled={addReview.isPending || !movieId}
          >
            {addReview.isPending ? "Adding..." : "Post review"}
          </button>
        </div>
      </div>
    </form>
  );
}
