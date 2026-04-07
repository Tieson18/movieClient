/**
 * Main App Component
 * 
 * Orchestrates all components and manages the application state
 */

import { useState } from 'react';
import { MovieList } from './components/MovieList';
import { AddMovieForm } from './components/AddMovieForm';
import { MovieStats } from './components/MovieStats';
import { UpdateMovieForm } from './components/UpdateMovieForm';
import type { Movie } from './types';
import './styles/App.css';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    function handleMovieAdded() {
        // Trigger a refresh of the movie list and stats
        setRefreshTrigger(prev => prev + 1);
    }

    function handleMovieDeleted() {
        // Trigger a refresh of the movie list and stats
        setRefreshTrigger(prev => prev + 1);
    }

    function handleMovieUpdated() {
        // Trigger a refresh of the movie list
        setRefreshTrigger(prev => prev + 1);
    }

    function handleMovieEdit(movie: Movie) {
        setSelectedMovie(movie);
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
                        <AddMovieForm onMovieAdded={handleMovieAdded} />
                        <MovieStats refreshTrigger={refreshTrigger} />
                    </div>

                    <div className="content">
                        <MovieList
                            onMovieDeleted={handleMovieDeleted}
                            onMovieEdit={handleMovieEdit}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </div>
            </main>

            <UpdateMovieForm
                movie={selectedMovie}
                onMovieUpdated={handleMovieUpdated}
                onCancel={() => setSelectedMovie(null)}
            />
        </div>
    );
}

export default App;
