import { Navigate, Route, Routes } from "react-router-dom";
import { AppNavigation } from "./components/AppNavigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { MoviePage } from "./pages/MoviePage";
import { SignupPage } from "./pages/SignupPage";
import { WatchlistPage } from "./pages/WatchlistPage";

function AuthenticatedShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AppNavigation />
      <Routes>
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/movies" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AuthenticatedShell />} />
      </Route>
    </Routes>
  );
}
