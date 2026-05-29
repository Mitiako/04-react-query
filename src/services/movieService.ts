import axios from 'axios';
import type { Movie } from '../types/movie';

// Базова URL адреса TMDB API
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

// Інтерфейс який описує структуру відповіді від TMDB API
// Визначений тут бо використовується тільки в цьому файлі
interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
}

// Функція для пошуку фільмів за ключовим словом та номером сторінки
export async function fetchMovies(
  // Ключове слово яке вводить користувач
  query: string,
  // Номер сторінки для пагінації (за замовчуванням перша сторінка)
  page: number = 1
): Promise<MovieSearchResponse> {
  // Виконуємо GET запит до TMDB API
  const response = await axios.get<MovieSearchResponse>(BASE_URL, {
    params: {
      // Передаємо пошуковий запит
      query: query,
      // Передаємо номер сторінки для пагінації
      page: page,
    },
    headers: {
      // Авторизація через Bearer токен зі змінної оточення
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  // Повертаємо об'єкт з масивом фільмів та загальною кількістю сторінок
  return response.data;
}