const movieRouter = require('express').Router();
const {
  getSavedMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getSavedMovies);
movieRouter.post('/movies', createMovie);
movieRouter.delete('/movies/:movieId', deleteMovie);

module.exports = movieRouter;
