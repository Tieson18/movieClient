/**
 * MovieList Component
 * 
 * Displays all movies and handles delete operations.
 * Uses the Kiota client to fetch movies with GET /movies
 */

import { useState, useEffect } from 'react';
import { getClient } from '../api/client';
// import type { Movie, MovieCollectionWithNextLink } from '../types';
import '../styles/MovieList.css';
import type { Genre, Movie } from '../types';

interface MovieListProps {
    onMovieDeleted: () => void;
    onMovieEdit: (movie: Movie) => void;
    refreshTrigger: number;
}

export function MovieList({ onMovieDeleted, onMovieEdit, refreshTrigger }: MovieListProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function fetchMovies() {
        try {
            setLoading(true);
            setError(null);

            // Get the client instance
            const client = getClient();

            // Make GET request to /movies using Kiota client
            // The client chainable API shows us calling .movies which gives us MoviesRequestBuilder,
            // then we call .get() to make the GET request
            const response = await client.movies.get();
            console.log(response);

            if (response) {
                const apiMovies = response.value ?? [];
                console.log(apiMovies);
                setMovies(apiMovies.map(movie => ({
                    id: movie.id ?? '',
                    title: movie.title ?? '',
                    director: movie.director ?? '',
                    releaseYear: Number(movie.additionalData?.release_year) || 0,
                    genre: (movie.genre ?? 'Drama') as Genre,
                    rating: movie.rating ?? 0,
                })));
            } else {
                setMovies([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch movies';
            console.error('Error fetching movies:', message);
            setError(`Failed to fetch movies: ${message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this movie?')) {
            return;
        }

        try {
            setDeletingId(id);
            const client = getClient();

            // Make DELETE request to /movies/{id}
            // The chainable API: .movies gives MoviesRequestBuilder
            // .byId(id) gives MoviesItemRequestBuilder for the specific movie
            // .delete() makes the DELETE request
            await client.movies.byId(id).delete();

            // Remove the movie from the list
            setMovies(movies.filter(m => m.id !== id));
            onMovieDeleted();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete movie';
            alert(`Error deleting movie: ${message}`);
        } finally {
            setDeletingId(null);
        }
    }

    // Fetch movies when component mounts or refresh trigger changes
    useEffect(() => {
        fetchMovies();
    }, [refreshTrigger]);

    if (loading) {
        return <div className="movies-container"><p className="loading">Loading movies...</p></div>;
    }

    if (error) {
        return <div className="movies-container"><p className="error">{error}</p></div>;
    }

    if (movies.length === 0) {
        return <div className="movies-container"><p className="empty">No movies found. Add one to get started!</p></div>;
    }

    return (
        <div className="movies-container">
            <h2>Movie Catalog ({movies.length})</h2>
            <div className="movies-grid">
                {movies.map(movie => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-header">
                            <h3>{movie.title}</h3>
                            <span className="genre">{movie.genre}</span>
                        </div>
                        <div className="movie-info">
                            <p><strong>Director:</strong> {movie.director}</p>
                            <p><strong>Year:</strong> {movie.releaseYear}</p>
                            <p><strong>Rating:</strong> {movie.rating.toFixed(1)}/10</p>
                        </div>
                        <div className="movie-actions">
                            <button
                                type="button"
                                className="btn-edit"
                                onClick={() => onMovieEdit(movie)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={() => handleDelete(movie.id)}
                                disabled={deletingId === movie.id}
                            >
                                {deletingId === movie.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
