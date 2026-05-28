import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import pkg from 'react-paginate/dist/react-paginate.js';

import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css';

// Отримуємо компонент пагінації з пакету react-paginate
const ReactPaginate = pkg.default;

export default function App() {
  // Зберігаємо пошуковий запит який ввів користувач
  const [query, setQuery] = useState<string>('');

  // Зберігаємо поточний номер сторінки пагінації
  const [page, setPage] = useState<number>(1);

  // Зберігаємо фільм який користувач обрав для перегляду деталей
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // Використовуємо TanStack Query для керування запитами та кешуванням
    // Хоча я почитав, що для таких маленьки проектів краще коричтуватися SWR )
  const { data, isLoading, isError } = useQuery({
    // Унікальний ключ запиту — оновлюється коли змінюється запит або сторінка
    queryKey: ['movies', query, page],
    // Функція яка виконує HTTP запит до TMDB API
    queryFn: () => fetchMovies(query, page),
    // Не виконуємо запит якщо пошуковий запит порожній
    enabled: query !== '',
  });

  // Отримуємо масив фільмів з відповіді або порожній масив
  const movies = data?.results ?? [];

  // Отримуємо загальну кількість сторінок з відповіді або 0
  const totalPages = data?.total_pages ?? 0;

  // Обробляємо відправку форми пошуку
  function handleSearch(newQuery: string) {
    // Якщо запит не змінився — нічого не робимо
    if (newQuery === query) return;

    // Зберігаємо новий пошуковий запит та скидаємо сторінку на першу
    setQuery(newQuery);
    setPage(1);
  }

    // Показуємо toast якщо пошук не знайшов жодного фільму
    // А не як минулого разу, коли я про нього забув ))
  // Показуємо toast якщо пошук не знайшов жодного фільму
useEffect(() => {
  if (data && movies.length === 0) {
    toast.error('No movies found for your request. Try a different query.');
  }
}, [data, movies.length]);

  // Відкриваємо модалку з обраним фільмом
  function handleSelectMovie(movie: Movie) {
    setSelectedMovie(movie);
  }

  // Закриваємо модалку та очищаємо обраний фільм
  function handleCloseModal() {
    setSelectedMovie(null);
  }

  // Збираємо всі компоненти разом — головна сцена нашого кінотеатру
  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {/* Показуємо лоадер поки завантажуються фільми */}
      {isLoading && <Loader />}
      {/* Показуємо помилку якщо запит не вдався */}
      {isError && <ErrorMessage />}
      {/* Показуємо галерею фільмів якщо є результати */}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {/* Показуємо пагінацію тільки якщо сторінок більше ніж одна */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {/* Показуємо модалку якщо користувач обрав фільм */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}