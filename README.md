# Movie Catalog React Frontend

A modern React + TypeScript frontend for the Movie API built with the Microsoft Kiota client.

## Project Structure

```
webapp/
├── src/
│   ├── api/
│   │   └── client.ts              # Kiota client initialization
│   ├── components/
│   │   ├── MovieList.tsx          # Display all movies with delete
│   │   ├── AddMovieForm.tsx       # Form to add new movies
│   │   ├── MovieStats.tsx         # Display statistics
│   │   └── UpdateMovieForm.tsx    # Modal form to update movies
│   ├── styles/
│   │   ├── index.css              # Global styles
│   │   ├── App.css                # App layout styles
│   │   ├── AddMovieForm.css       # Add movie form styles
│   │   ├── MovieList.css          # Movie list styles
│   │   ├── MovieStats.css         # Stats display styles
│   │   └── UpdateMovieForm.css    # Update form modal styles
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # React entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd webapp
npm install
```

This installs:
- `react` & `react-dom`: UI framework
- `@microsoft/kiota-abstractions`: Kiota SDK abstractions
- `@microsoft/kiota-http-fetchadapter`: HTTP adapter using fetch API
- `vite`: Build tool and dev server
- `typescript`: Type safety

### 2. Start Development Server

```bash
npm run dev
```

This starts Vite on `http://localhost:5173` with hot module reloading.

### 3. Build for Production

```bash
npm run build
```

This outputs optimized production build to `dist/` folder.

## How the Kiota Client Works

### Client Architecture

The generated Kiota client provides a fluent, chainable API for accessing your REST endpoints:

```
PostsClient (main entry point)
  └── .movies (MoviesRequestBuilder)
       ├── .get()           → GET /movies
       ├── .post(data)      → POST /movies
       ├── .byId(id)        → /movies/{id} (MoviesItemRequestBuilder)
       │    ├── .get()      → GET /movies/{id}
       │    ├── .patch()    → PATCH /movies/{id}
       │    └── .delete()   → DELETE /movies/{id}
       └── .stats           → /movies/stats (StatsRequestBuilder)
            └── .get()      → GET /movies/stats
```

### Request Adapter

The **FetchRequestAdapter** handles HTTP communication:

```typescript
const requestAdapter = new FetchRequestAdapter();
requestAdapter.baseUrl = 'http://localhost:3000';
```

It:
- Uses the browser's `fetch()` API
- Handles JSON serialization/deserialization
- Manages request headers and authentication
- Converts responses to TypeScript objects

### Client Initialization

See [src/api/client.ts](src/api/client.ts):

```typescript
function initializeClient(): PostsClient {
  const requestAdapter = new FetchRequestAdapter();
  requestAdapter.baseUrl = 'http://localhost:3000';
  return createPostsClient(requestAdapter);
}
```

The client is a singleton - it's created once and reused throughout the app.

## API Usage Examples

### GET /movies - Fetch All Movies

```typescript
const client = getClient();
const response = await client.movies.get();
// response: MovieCollectionWithNextLink { value: Movie[] }
```

### POST /movies - Add New Movie

```typescript
const client = getClient();
const newMovie = await client.movies.post({
  title: "Inception",
  director: "Christopher Nolan",
  releaseYear: 2010,
  genre: "Sci-Fi",
  rating: 8.8
});
// Returns: Movie { id, title, director, ... }
```

### PATCH /movies/{id} - Update Movie

```typescript
const client = getClient();
const updated = await client.movies.byId('123').patch({
  rating: 9.0,
  title: "Inception (Director's Cut)"
});
// Returns: Movie with updated fields
```

### DELETE /movies/{id} - Delete Movie

```typescript
const client = getClient();
const result = await client.movies.byId('123').delete();
// Returns: { message: "Movie deleted" }
```

### GET /movies/stats - Get Statistics

```typescript
const client = getClient();
const stats = await client.movies.stats.get();
// Returns: { totalMovies: 5, averageRating: 8.2 }
```

## Components

### MovieList
- Displays all movies in a responsive grid
- Shows title, director, year, genre, and rating
- Delete button with confirmation
- Loading and error states

### AddMovieForm
- Form with validation
- Genre selection dropdown
- Rating input (0-10)
- Success/error notifications
- Triggers movie list refresh on success

### MovieStats
- Shows total movie count
- Shows average rating
- Sticky positioning for easy access
- Auto-refreshes with list

### UpdateMovieForm
- Modal overlay with close button
- Partial updates (all fields optional)
- Validation and error handling
- Success message with auto-close

## State Management

Uses React Hooks:
- `useState`: Component-level state (movies, loading, error)
- `useEffect`: Side effects (fetching data when component mounts)
- `refreshTrigger`: Simple number that increments to trigger re-fetches

## Error Handling

Each component has:
- Try-catch blocks around API calls
- User-friendly error messages
- Loading states during async operations
- Disabled buttons during operations

## Type Safety

Full TypeScript support:
- Generated types from Kiota client
- Component prop types
- API response types
- Form data types

## Browser Support

- Modern browsers with ES2020 and fetch API support
- Chrome, Firefox, Safari, Edge (latest versions)

## Development Tips

1. **Hot Module Reloading**: Changes auto-refresh without losing state
2. **DevTools**: React DevTools browser extension for debugging
3. **Network Tab**: Check API calls in browser DevTools
4. **Console**: TypeScript errors appear in console
5. **API Health**: Ensure backend is running on `localhost:3000`

## Troubleshooting

### "Failed to fetch" errors
- Check backend is running on `localhost:3000`
- Check for CORS issues in browser console
- Verify API responses in Network tab

### Client not initialized
- Check that `getClient()` is called after imports
- Verify `@microsoft/kiota-*` packages are installed

### Type errors
- Run `npm run build` to check TypeScript compilation
- Check that types.ts is up-to-date with API changes

## Next Steps

1. Add authentication (JWT tokens in request headers)
2. Add pagination support for large movie lists
3. Add search/filter functionality
4. Add sorting options
5. Add movie details page with more information
6. Add image uploads for movie posters
7. Add user reviews/ratings
