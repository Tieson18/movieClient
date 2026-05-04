import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser, fetchUsers, loginUser, registerUser } from "../api/queries";
import type { LoginCredentials, RegisterCredentials } from "../types";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserProfile(id: string | null | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => fetchUser(id ?? ""),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterCredentials) => registerUser(payload),
    onSuccess: async ({ user }) => {
      queryClient.setQueryData(userKeys.detail(user.id), user);
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginCredentials) => loginUser(payload),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(userKeys.detail(user.id), user);
    },
  });
}
