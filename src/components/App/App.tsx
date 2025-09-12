import { useState, useEffect } from 'react'
import css from './App.module.css'
import fetchMovies from '../../services/movieService.ts'
import SearchBar from '../SearchBar/SearchBar.tsx'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import type { Movie } from '../../types/movie.ts'

import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate';

function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [curPage, setPage] = useState(1);

  const handleSubmit = async (query: string) => { 
    setQuery(query);
  }
  
  const {data, isLoading, isError, isSuccess} = useQuery({
    queryKey: ['movies', query, curPage],
    queryFn: () => fetchMovies({ query, curPage }),
    enabled: query.length > 0,
  });

  console.log('data',data);

  //check if no movies found
  useEffect(() => {
    if (!isLoading && query && data?.results.length === 0) {
      toast.error('No movies found for your query');
    }
}, [isLoading, query, data]);

  //handle movie click 
  const handleClick = (movie: Movie) => {
    console.log(movie);
    setSelectedMovie(movie);
  }

  const closeModal = () => {
    setSelectedMovie(null);
  }

  return (
    <>
      <div className={css.app}>
        <Toaster />
        <SearchBar onSubmit={handleSubmit}></SearchBar>
        {isLoading && <Loader message='Loading movies, please wait...'></Loader>
        }
        {isError ? (<ErrorMessage></ErrorMessage>) : (
          data && data.results && data.results.length > 0 && <MovieGrid onSelect={handleClick} movies={data?.results}></MovieGrid>
        )}
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}></MovieModal>}
        {isSuccess &&
          <ReactPaginate
            pageCount={data?.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={curPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
      />}
      </div>
    </>
  )
}

export default App
