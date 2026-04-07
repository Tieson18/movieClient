/**
 * MovieStats Component
 * 
 * Displays statistics about the movie collection using GET /movies/stats
 */

import { useState, useEffect } from 'react';
import { getClient } from '../api/client';
import type { Stats } from '../types';
import '../styles/MovieStats.css';

interface MovieStatsProps {
    refreshTrigger: number;
}

export function MovieStats({ refreshTrigger }: MovieStatsProps) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, [refreshTrigger]);

    async function fetchStats() {
        try {
            setLoading(true);
            setError(null);

            const client = getClient();

            // Make GET request to /movies/stats
            // The chainable API: .movies gives MoviesRequestBuilder
            // .stats gives StatsRequestBuilder
            // .get() makes the GET request
            const response = await client.movies.stats.get();

            if (response) {
                setStats(response as Stats);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch stats';
            console.error('Error fetching stats:', message);
            setError(`Failed to fetch stats: ${message}`);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="stats-container"><p className="loading">Loading stats...</p></div>;
    }

    if (error) {
        return <div className="stats-container"><p className="error">{error}</p></div>;
    }

    return (
        <div className="stats-container">
            <h2>Statistics</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats?.totalMovies || 0}</div>
                    <div className="stat-label">Total Movies</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}</div>
                    <div className="stat-label">Average Rating</div>
                </div>
            </div>
        </div>
    );
}
