import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { AuthResponse, AuthSession, User } from "../types";
import { getToken, getUser, logout as clearAuthStorage, setAuthSession as persistAuthSession } from "../utils/auth";

export const getStoredAuthSession = (): AuthSession | null => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return null;
  }

  return {
    token,
    userId: user.id,
    role: user.role,
    user,
  };
};

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  userId: string | null;
  role: AuthSession["role"] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredAuthSession());

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      userId: session?.userId ?? null,
      role: session?.role ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token && session.userId),
      login: (payload) => {
        persistAuthSession(payload);

        setSession({
          token: payload.token,
          userId: payload.user.id,
          role: payload.user.role,
          user: payload.user,
        });
      },
      logout: () => {
        clearAuthStorage();
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
