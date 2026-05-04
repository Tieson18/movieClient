import type { AuthResponse, User } from "../types";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getUser(): User | null {
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.error("Failed to parse stored user", error);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function setAuthSession(session: AuthResponse) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
}

export function logout() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}
