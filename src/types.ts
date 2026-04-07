/**
 * Type definitions for the application
 *
 * These types are imported from the generated Kiota client and type.d.ts
 */

export interface Movie {
  id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: Genre;
  rating: number;
}

export interface MovieCreate {
  title: string;
  director: string;
  releaseYear: number;
  genre: Genre;
  rating: number;
}

export interface MovieUpdate {
  title?: string;
  director?: string;
  releaseYear?: number;
  genre?: Genre;
  rating?: number;
}

export type Genre = "Action" | "Drama" | "Comedy" | "Sci-Fi";

export interface Stats {
  totalMovies?: number;
  averageRating?: number;
}

export interface MovieCollectionWithNextLink {
  value?: Movie[];
  "@odata.nextLink"?: string;
}
