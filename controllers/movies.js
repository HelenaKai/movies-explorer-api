const { ValidationError } = require('mongoose').Error;
const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// Функция createMovie создает новый фильм в базе данных,
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  // Создание нового фильма в базе данных
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id, // Связываем фильм с текущим пользователем по id
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки фильма.'));
      } else {
        next(error);
      }
    });
};

// Получение массива с фильмами
const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    /* .populate(['owner', '_id']) */
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

// Удаление фильма
const deleteMovie = (req, res, next) => {
/* const { movieId } = req.params; */

  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('фильм с указанным _id не найден');
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Невозможно удалить фильм');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные удаления'));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
