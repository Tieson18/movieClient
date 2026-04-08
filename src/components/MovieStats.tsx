import { useMovieStats } from '../hooks/useMovieStats'
import '../styles/MovieStats.css'

// interface MovieStatsProps {
// }

export function MovieStats() {
    const { data: stats, isLoading, error } = useMovieStats()

    if (isLoading) {
        return (
            <div className="stats-container">
                <p className="loading">Loading stats...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="stats-container">
                <p className="error">Failed to fetch stats</p>
            </div>
        )
    }

    return (
        <div className="stats-container">
            <h2>Statistics</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">
                        {stats?.totalMovies || 0}
                    </div>
                    <div className="stat-label">Total Movies</div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {stats?.averageRating
                            ? stats.averageRating.toFixed(1)
                            : 'N/A'}
                    </div>
                    <div className="stat-label">Average Rating</div>
                </div>
            </div>
        </div>
    )
}