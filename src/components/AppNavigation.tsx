import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigationItems = [
  { label: "Movies", to: "/movies" },
  { label: "Watchlist", to: "/watchlist" },
];

export function AppNavigation() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Movie Platform</p>
          <h1 className="mt-1 text-xl font-semibold text-white">{user ? `Welcome, ${user.name}` : "Movie Platform"}</h1>
          <p className="text-sm text-slate-400">Browse, review, and keep your watchlist close.</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-sky-500 text-slate-950"
                    : "border border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700 hover:bg-slate-800",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              {user.role}
            </span>
          ) : null}
          <button
            type="button"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
