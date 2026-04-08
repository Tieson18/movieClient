/**
 * AddMovieForm Component (Optimized with React Query)
 * 
 * Form to add a new movie using POST /movies
 * Uses mutation + cache invalidation for real-time UI updates
 */

import { useState } from 'react'
import { getClient } from '../api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Genre, MovieCreate } from '../types'
import '../styles/AddMovieForm.css'

const GENRES: Genre[] = ['Action', 'Drama', 'Comedy', 'Sci-Fi']

interface AddMovieFormProps {
    onMovieAdded: () => void
}

export function AddMovieForm({ onMovieAdded }: AddMovieFormProps) {
    const [formData, setFormData] = useState<MovieCreate>({
        title: '',
        director: '',
        releaseYear: new Date().getFullYear(),
        genre: 'Drama',
        rating: 7.5,
    })

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const queryClient = useQueryClient()

    // 🔥 React Query mutation
    const addMovieMutation = useMutation({
        mutationFn: async (movie: MovieCreate) => {
            const client = getClient()
            return await client.movies.post(movie)
        },
        onSuccess: () => {
            // Refresh cached data
            queryClient.invalidateQueries({ queryKey: ['movies'] })
            queryClient.invalidateQueries({ queryKey: ['movieStats'] })

            setSuccess(true)

            // Reset form
            setFormData({
                title: '',
                director: '',
                releaseYear: new Date().getFullYear(),
                genre: 'Drama',
                rating: 7.5,
            })

            setTimeout(() => setSuccess(false), 3000)

            // Optional (can remove later)
            onMovieAdded()
        },
        onError: (err) => {
            const message = err instanceof Error ? err.message : 'Failed to add movie'
            console.error('Error adding movie:', message)
            setError(`Failed to add movie: ${message}`)
        }
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]:
                name === 'releaseYear' || name === 'rating'
                    ? parseFloat(value)
                    : value,
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        // Validation
        if (!formData.title.trim() || !formData.director.trim()) {
            setError('Title and director are required')
            return
        }

        if (formData.rating < 0 || formData.rating > 10) {
            setError('Rating must be between 0 and 10')
            return
        }

        addMovieMutation.mutate(formData)
    }

    return (
        <div className="add-movie-form">
            <h2>Add New Movie</h2>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">Movie added successfully!</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter movie title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="director">Director *</label>
                    <input
                        id="director"
                        type="text"
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        placeholder="Enter director name"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="releaseYear">Release Year</label>
                        <input
                            id="releaseYear"
                            type="number"
                            name="releaseYear"
                            value={formData.releaseYear}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="genre">Genre</label>
                        <select
                            id="genre"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                        >
                            {GENRES.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="rating">Rating</label>
                        <input
                            id="rating"
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            min="0"
                            max="10"
                            step="0.1"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-submit"
                    disabled={addMovieMutation.isPending}
                >
                    {addMovieMutation.isPending ? 'Adding...' : 'Add Movie'}
                </button>
            </form>
        </div>
    )
}