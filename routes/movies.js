const movieRouter = require('express').Router();
const {
  getSavedMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

movieRouter.get('/movies', getSavedMovies);
movieRouter.post('/movies', validationCreateMovie, createMovie);
movieRouter.delete('/movies/:movieId', validationDeleteMovie, deleteMovie);

module.exports = movieRouter;
