import axios from "axios";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

export interface fetchMoviesOps {
  query: string;
  adult?: boolean;
}

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const options = {
  headers: {
    accept: `application/json`,
    Authorization: `Bearer ${API_KEY}`
  }
};

export default async function fetchMovies({ query, adult = false }: fetchMoviesOps): Promise<MoviesResponse> {
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=${adult}&language=en-US&page=1`;

  try {
    const response = await axios.get<MoviesResponse>(url, options);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }

}

