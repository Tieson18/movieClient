import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReview, fetchReviews } from "../api/queries";
import type { ReviewCreate } from "../types";

export const reviewKeys = {
  all: ["reviews"] as const,
  byMovie: (movieId: string) => ["reviews", movieId] as const,
};

export function useReviews(movieId: string | null | undefined) {
  return useQuery({
    queryKey: reviewKeys.byMovie(movieId ?? ""),
    queryFn: () => fetchReviews(movieId ?? ""),
    enabled: Boolean(movieId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewCreate) => addReview(payload),
    onSuccess: async (_review, payload) => {
      await queryClient.invalidateQueries({ queryKey: reviewKeys.byMovie(payload.movieId) });
    },
  });
}
