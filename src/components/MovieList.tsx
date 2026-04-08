/**
 * MovieList Component (Optimized with React Query)
 * 
 * Displays all movies and handles delete operations.
 * Uses caching to avoid unnecessary API requests.
 */

import { useState } from 'react'
import { getClient } from '../api/client'
import { useMovies } from '../hooks/useMovies'
import { useQueryClient } from '@tanstack/react-query'
import '../styles/MovieList.css'
import type { Movie } from '../types'

interface MovieListProps {
    onMovieDeleted: () => void
    onMovieEdit: (movie: Movie) => void
    refreshTrigger: number
}

export function MovieList({ onMovieDeleted, onMovieEdit }: MovieListProps) {
    const { data: movies = [], isLoading, error } = useMovies()
    const queryClient = useQueryClient()

    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this movie?')) {
            return
        }

        try {
            setDeletingId(id)
            const client = getClient()

            await client.movies.byId(id).delete()

            // 🔥 Refresh cached data
            await queryClient.invalidateQueries({ queryKey: ['movies'] })

            onMovieDeleted()
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete movie'
            alert(`Error deleting movie: ${message}`)
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="movies-container">
                <p className="loading">Loading movies...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="movies-container">
                <p className="error">Failed to fetch movies</p>
            </div>
        )
    }

    if (movies.length === 0) {
        return (
            <div className="movies-container">
                <p className="empty">No movies found. Add one to get started!</p>
            </div>
        )
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
    )
}