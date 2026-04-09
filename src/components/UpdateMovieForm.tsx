/**
 * UpdateMovieForm Component
 * 
 * Form to update an existing movie using PATCH /movies/{id}
 */

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getClient } from '../api/client';
import type { Genre, Movie, MovieUpdate } from '../types';
import '../styles/UpdateMovieForm.css';

const GENRES: Genre[] = ['Action', 'Drama', 'Comedy', 'Sci-Fi'];

interface UpdateMovieFormProps {
    movie: Movie | null;
    onCancel: () => void;
}

export function UpdateMovieForm({ movie, onCancel }: UpdateMovieFormProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<MovieUpdate>(
        movie ? {
            title: movie.title,
            director: movie.director,
            releaseYear: movie.releaseYear,
            genre: movie.genre,
            rating: movie.rating,
        } : {}
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Sync form data when movie prop changes
    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title,
                director: movie.director,
                releaseYear: movie.releaseYear,
                genre: movie.genre,
                rating: movie.rating,
            });
            setError(null);
            setSuccess(false);
        }
    }, [movie]);

    if (!movie) {
        return null;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'releaseYear' || name === 'rating'
                ? parseFloat(value)
                : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const currentMovie = movie;
        if (!currentMovie) {
            return;
        }

        // Validation
        if (formData.title && !formData.title.trim()) {
            setError('Title cannot be empty');
            return;
        }

        if (formData.director && !formData.director.trim()) {
            setError('Director cannot be empty');
            return;
        }

        if (formData.rating && (formData.rating < 0 || formData.rating > 10)) {
            setError('Rating must be between 0 and 10');
            return;
        }

        try {
            setLoading(true);
            const client = getClient();

            const updatedMovie = await client.movies.byId(currentMovie.id).patch(formData);

            if (updatedMovie) {
                await queryClient.invalidateQueries({ queryKey: ['movies'] });
                await queryClient.invalidateQueries({ queryKey: ['movieStats'] });

                setSuccess(true);
                setTimeout(() => {
                    onCancel();
                }, 1500);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update movie';
            console.error('Error updating movie:', message);
            setError(`Failed to update movie: ${message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="update-movie-overlay">
            <div className="update-movie-form">
                <div className="form-header">
                    <h2>Update Movie</h2>
                    <button type="button" className="btn-close" onClick={onCancel}>×</button>
                </div>

                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">Movie updated successfully!</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="update-title">Title</label>
                        <input
                            id="update-title"
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            placeholder="Enter movie title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="update-director">Director</label>
                        <input
                            id="update-director"
                            type="text"
                            name="director"
                            value={formData.director || ''}
                            onChange={handleChange}
                            placeholder="Enter director name"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="update-releaseYear">Release Year</label>
                            <input
                                id="update-releaseYear"
                                type="number"
                                name="releaseYear"
                                value={formData.releaseYear || ''}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="update-genre">Genre</label>
                            <select
                                id="update-genre"
                                name="genre"
                                value={formData.genre || ''}
                                onChange={handleChange}
                            >
                                <option value="">Select a genre</option>
                                {GENRES.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="update-rating">Rating</label>
                            <input
                                id="update-rating"
                                type="number"
                                name="rating"
                                value={formData.rating || ''}
                                onChange={handleChange}
                                min="0"
                                max="10"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Movie'}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}