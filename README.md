# Movie Client

A modern React + TypeScript frontend for the Movie Platform API. Built with Vite, TanStack Query, Tailwind CSS, and a Microsoft Kiota-generated type-safe API client.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router v7 |
| Server State | TanStack React Query v5 |
| API Client | Microsoft Kiota (generated from OpenAPI spec) |
| Auth | JWT stored in `localStorage`, injected via patched Kiota adapter |
| Deployment | Azure Static Web Apps (GitHub Actions) |

---

## Features

- **Authentication** — login/signup pages with JWT session management via React Context
- **Protected routes** — unauthenticated users are redirected to `/login`
- **Movie browsing** — paginated movie list with card view
- **Movie details** — dedicated detail page with TMDB-enriched data and reviews
- **Watchlist** — add/remove movies from a personal watchlist
- **Type-safe API client** — generated from `openapi.yaml` via Microsoft Kiota, with all HTTP calls strongly typed end-to-end

---

## Getting Started

### Prerequisites

- Node.js v18+
- The Movie Platform API running and accessible

### Installation

```bash
git clone <your-repo-url>
cd movieClient
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

For production, point this at your deployed API base URL.

> ⚠️ Never commit secrets to version control. The `.env` file is listed in `.gitignore`.

### Running the Dev Server

```bash
npm run dev
```

Starts Vite on `http://localhost:5173` with hot module reloading.

### Building for Production

```bash
npm run build
```

Outputs an optimized build to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## Project Structure

```
movieClient/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── App.tsx                      # Root component, routing shell
    ├── main.tsx                     # React entry point
    ├── api/
    │   ├── client.ts                # Kiota client init + JWT auth patch
    │   ├── errors.ts                # API error helpers
    │   ├── mappers.ts               # API response → UI type mappers
    │   ├── queries.ts               # TanStack Query hooks
    │   └── client/                  # Generated Kiota client (do not edit manually)
    │       ├── movieClient.ts
    │       ├── models/index.ts
    │       ├── auth/
    │       ├── movies/
    │       ├── reviews/
    │       ├── users/
    │       └── watchlist/
    ├── components/
    │   ├── AppNavigation.tsx
    │   ├── MovieCard.tsx
    │   ├── MovieList.tsx
    │   ├── AddMovieForm.tsx
    │   ├── UpdateMovieForm.tsx
    │   ├── ReviewForm.tsx
    │   ├── MovieStats.tsx
    │   ├── WatchlistButton.tsx
    │   ├── ProtectedRoute.tsx
    │   └── StatusMessage.tsx
    ├── context/
    │   └── AuthContext.tsx           # Auth state, login/logout, session persistence
    ├── hooks/
    │   ├── useMovies.ts
    │   ├── useMovieStats.ts
    │   └── useReviews.ts
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── SignupPage.tsx
    │   ├── MoviePage.tsx
    │   ├── MovieDetailsPage.tsx
    │   └── WatchlistPage.tsx
    ├── types/                        # Shared TypeScript types
    └── utils/
        └── auth.ts                  # Token/user localStorage helpers
```

---

## API Client

The API client (`src/api/client/`) is generated from `movieopenapi.yaml` using [Microsoft Kiota](https://github.com/microsoft/kiota). It provides a fluent, fully typed interface for every API endpoint.

> **Do not edit files inside `src/api/client/` by hand.** Regenerate them when the OpenAPI spec changes.

To regenerate:

```bash
# From the project root (requires Kiota CLI)
kiota generate -l typescript -d movieopenapi.yaml -c MovieClient -o ./src/api/client
```

### Client Architecture

```
MovieClient (entry point)
  ├── .auth
  │    ├── .login.post()         → POST /auth/login
  │    └── .register.post()      → POST /auth/register
  ├── .movies
  │    ├── .get()                → GET  /movies
  │    ├── .post()               → POST /movies
  │    ├── .stats.get()          → GET  /movies/stats
  │    └── .byMovieId(id)
  │         ├── .get()           → GET  /movies/{id}
  │         ├── .put()           → PUT  /movies/{id}
  │         ├── .delete()        → DELETE /movies/{id}
  │         ├── .details.get()   → GET  /movies/{id}/details
  │         └── .reviews.get()   → GET  /movies/{id}/reviews
  ├── .reviews
  │    ├── .post()               → POST /reviews
  │    └── .byReviewId(id)
  │         ├── .put()           → PUT  /reviews/{id}
  │         └── .delete()        → DELETE /reviews/{id}
  ├── .users.byUserId(id)
  │    ├── .get()                → GET  /users/{id}
  │    ├── .put()                → PUT  /users/{id}
  │    └── .watchlist.get()      → GET  /users/{id}/watchlist
  └── .watchlist
       ├── .post()               → POST /watchlist
       └── .byWatchlistId(id).delete()  → DELETE /watchlist/{id}
```

### JWT Authentication

Authentication is handled by patching the Kiota `FetchRequestAdapter` to inject an `Authorization: Bearer <token>` header on every outbound request. The token is read from `localStorage` via `getToken()` in `src/utils/auth.ts`.

```typescript
// src/api/client.ts (simplified)
const adapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider());
adapter.baseUrl = API_BASE_URL;
patchAdapter(adapter); // injects JWT header on every call
```

The client is a singleton — initialized once and reused across the app via `getClient()`.

---

## Routing

```
/               → redirects to /movies (authenticated) or /login
/login          → LoginPage
/signup         → SignupPage
/movies         → MoviePage          (protected)
/movies/:id     → MovieDetailsPage   (protected)
/watchlist      → WatchlistPage      (protected)
```

All routes under `/movies` and `/watchlist` are wrapped in `<ProtectedRoute />`. Unauthenticated users are automatically redirected to `/login`.

---

## State Management

- **Auth state** — managed by `AuthContext` (`src/context/AuthContext.tsx`). Session data (token, user, role) is persisted to `localStorage` and hydrated on page load.
- **Server state** — managed by TanStack React Query. Query hooks live in `src/api/queries.ts` and `src/hooks/`.
- **Local UI state** — component-level `useState` and `useEffect`.

---

## Linting

```bash
npm run lint
```

Uses ESLint with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.

---

## CI/CD

A GitHub Actions workflow (`.github/workflows/azure-static-web-apps-*.yml`) builds and deploys the app to **Azure Static Web Apps** on every push to `main`.

---

## Troubleshooting

**"Failed to fetch" errors** — make sure the API is running and `VITE_API_URL` points to the correct host. Check the browser Network tab for CORS errors.

**Blank page after login** — verify the API returned a valid JWT and that it's stored correctly in `localStorage`.

**Type errors after API changes** — regenerate the Kiota client from the updated OpenAPI spec, then run `npm run build` to surface any type mismatches.

**401 on protected routes** — the JWT may be expired. Log out and log back in to obtain a fresh token.
