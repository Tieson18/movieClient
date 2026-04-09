import { useState } from 'react'
import { MovieList } from './components/MovieList'
import { AddMovieForm } from './components/AddMovieForm'
import { MovieStats } from './components/MovieStats'
import { UpdateMovieForm } from './components/UpdateMovieForm'
import type { Movie } from './types'
import './styles/App.css'

function App() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

    function handleMovieEdit(movie: Movie) {
        setSelectedMovie(movie)
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>🎬 Movie Catalog</h1>
                <p>Manage your movie collection</p>
            </header>

            <main className="app-main">
                <div className="layout">
                    <div className="sidebar">
                        <AddMovieForm />
                        <MovieStats />
                    </div>

                    <div className="content">
                        <MovieList
                            onMovieEdit={handleMovieEdit}
                        />
                    </div>
                </div>
            </main>

            <UpdateMovieForm
                movie={selectedMovie}
                onMovieUpdated={() => { }}
                onCancel={() => setSelectedMovie(null)}
            />
        </div>
    )
}

export default App