// Інтерфейс який описує структуру одного фільму з TMDB API
export interface Movie {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

// Інтерфейс який описує структуру відповіді від TMDB API
// Тепер нам також потрібна загальна кількість сторінок для пагінації
export interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
}