import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { StatusMessage } from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { useLoginUser } from "../hooks/useUsers";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const loginUser = useLoginUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/movies" replace />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const authResponse = await loginUser.mutateAsync({
        email: email.trim(),
        password,
      });
      login(authResponse);
      const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/movies";
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      console.error("Unable to log in", loginError);
      setError(loginError instanceof Error ? loginError.message : "Unable to log in.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Movie Platform</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Log in</h1>
          <p className="mt-2 text-sm text-slate-400">Use your email and password to continue.</p>
        </div>

        <div className="mt-5">{error ? <StatusMessage kind="error">{error}</StatusMessage> : null}</div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loginUser.isPending}
          >
            {loginUser.isPending ? "Logging in..." : "Continue"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Need an account?{" "}
          <Link to="/signup" className="font-medium text-sky-300 hover:text-sky-200">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
