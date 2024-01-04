const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
// Koneksi ke MongoDB menggunakan Mongoose
mongoose.connect('mongodb://localhost:27017/film', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Skema dan model untuk pengguna
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Bidang untuk menyimpan password yang di-hash
  // Tambahkan bidang lain sesuai kebutuhan
});

const User = mongoose.model('User', userSchema);

// Middleware untuk mengakses body pada request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'views')));

// Route to redirect to login page when accessing root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Dapatkan informasi pengguna dari database berdasarkan username/email
    const user = await User.findOne({ username }); // Misalnya menggunakan Mongoose
  
    if (!user) {
      return res.status(400).send('Username tidak ditemukan');
    }
  
    // Bandingkan sandi yang dimasukkan dengan sandi yang di-hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(400).send('Sandi salah');
    }
  
    // Jika sandi benar, arahkan ke halaman home
    res.redirect('/home');
  });

// Route to serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Route to handle signup form submission
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds
    
    // Buat instance User baru dengan password yang di-hash
    const newUser = new User({ username, email, password: hashedPassword });
    
    // Simpan data pengguna ke MongoDB
    await newUser.save();
    
    // Redirect to login page after signup
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menyimpan pengguna.');
  }
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  });
  
  app.use(express.static('public'));

  app.get('/movies/topRated', async (req, res) => {
    const apiKey = '3fcb98bb395dd734a620000d9c98ea20'; // Ganti dengan kunci API TMDb Anda
  
    try {
      const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      res.json(data.results);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      res.status(500).json({ error: 'Error fetching top rated movies' });
    }
  });

  app.use(express.static('public'));

  app.get('/movie/details/:movieTitle', async (req, res) => {
    const { movieTitle } = req.params;
    const apiKey = '3fcb98bb395dd734a620000d9c98ea20'; // Ganti dengan kunci API TMDb Anda
  
    try {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
  
      if (searchData.results.length > 0) {
        const movieId = searchData.results[0].id;
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
        const movieResponse = await fetch(movieUrl);
        const movieData = await movieResponse.json();
  
        res.json({
          title: movieData.title,
          poster: movieData.poster_path,
          overview: movieData.overview
        });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Error fetching movie details' });
    }
  });
  
  app.use(express.static('public'));

  app.get('/genres', async (req, res) => {
    const apiKey = '3fcb98bb395dd734a620000d9c98ea20'; // Ganti dengan kunci API TMDb Anda
  
    try {
      const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      res.json(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'Error fetching genres' });
    }
  });
  
  app.get('/movies/genre/:genreId', async (req, res) => {
    const { genreId } = req.params;
    const apiKey = '3fcb98bb395dd734a620000d9c98ea20'; // Ganti dengan kunci API TMDb Anda
  
    try {
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      res.json(data.results);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      res.status(500).json({ error: 'Error fetching movies by genre' });
    }
  });

  const apiKey = '3fcb98bb395dd734a620000d9c98ea20'; // Ganti dengan API key TMDb kamu

app.get('/popular-movies', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching popular movies');
  }
});





  
// Endpoint untuk logout
app.post('/logout', (req, res) => {
  // Membersihkan session atau melakukan tindakan logout lainnya
  // ...

  // Redirect kembali ke halaman login setelah logout
  res.redirect('/login');
});

// Endpoint untuk halaman login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

  
  // Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});