// script.js
async function getTopRatedMovies() {
  try {
    const response = await fetch('/movies/topRated');
    const data = await response.json();

    displayTopRatedMovies(data);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
  }
}

function displayTopRatedMovies(data) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  if (data && data.length > 0) {
    data.forEach(movie => {
      const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      moviesContainer.innerHTML += `
        <div class="movie">
          <h2>${movie.title}</h2>
          <img src="${imageUrl}" alt="${movie.title} Poster">
          <p>Rating: ${movie.vote_average}</p>
          <p>${movie.overview}</p>
        </div>
      `;
    });
  } else {
    moviesContainer.innerHTML = '<p>No top rated movies found.</p>';
  }
}


// script.js
async function getMovieDetails() {
  const movieTitle = document.getElementById('movieTitleInput').value;

  try {
    const response = await fetch(`/movie/details/${movieTitle}`);
    const data = await response.json();

    displayMovieDetails(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}

function displayMovieDetails(data) {
  const detailsContainer = document.getElementById('detailsContainer');
  detailsContainer.innerHTML = '';

  if (data && data.title) {
    const imageUrl = `https://image.tmdb.org/t/p/w500${data.poster}`;
    detailsContainer.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${imageUrl}" alt="${data.title} Poster">
      <p>${data.overview}</p>
    `;
  } else {
    detailsContainer.innerHTML = '<p>Movie details not found.</p>';
  }
}

// script.js
// script.js
async function getGenres() {
  try {
    const response = await fetch('/genres');
    const data = await response.json();

    displayGenres(data);
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
}

async function getMoviesByGenre(genreId) {
  try {
    const response = await fetch(`/movies/genre/${genreId}`);
    const data = await response.json();

    displayMoviesByGenre(data);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
  }
}

function displayGenres(genres) {
  const genresContainer = document.getElementById('genresContainer');
  genresContainer.innerHTML = '';

  if (genres && genres.length > 0) {
    genres.forEach(genre => {
      const genreBtn = document.createElement('button'); // Membuat elemen tombol
      genreBtn.textContent = genre.name;
      genreBtn.addEventListener('click', () => getMoviesByGenre(genre.id));
      genresContainer.appendChild(genreBtn);
    });
  } else {
    genresContainer.innerHTML = '<p>No genres found.</p>';
  }
}

function displayMoviesByGenre(movies) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  if (movies && movies.length > 0) {
    movies.forEach(movie => {
      const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      moviesContainer.innerHTML += `
        <div class="movie">
          <h2>${movie.title}</h2>
          <img src="${imageUrl}" alt="${movie.title} Poster">
          <p>Rating: ${movie.vote_average}</p>
          <p>${movie.overview}</p>
        </div>
      `;
    });
  } else {
    moviesContainer.innerHTML = '<p>No movies found for this genre.</p>';
  }
}
// Fungsi untuk menampilkan daftar film ke dalam elemen HTML
function displayMovies(movies) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <h2>${movie.title}</h2>
      <img src="${imageUrl}" alt="${movie.title} Poster">
      <p>Rating: ${movie.vote_average}</p>
      <p>${movie.overview}</p>
    `;
    moviesContainer.appendChild(movieElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/popular-movies')
    .then(response => response.json())
    .then(data => displayPopularMovies(data.results))
    .catch(error => console.error('Error:', error));
});

function displayPopularMovies(movies) {
  const popularMoviesContainer = document.getElementById('popularMoviesContainer');
  popularMoviesContainer.innerHTML = '';

  movies.forEach(movie => {
    // Buat elemen HTML untuk setiap film dan tambahkan ke container
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <h2>${movie.title}</h2>
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title} Poster">
      <p>${movie.overview}</p>
      <!-- Tambahkan elemen lain sesuai kebutuhan -->
    `;
    popularMoviesContainer.appendChild(movieElement);
  });
}

