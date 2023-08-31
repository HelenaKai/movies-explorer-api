const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const { JWT_SECRET_DEV } = require('../utils/constant');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

// Создать пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      next(err);
      return;
    }

    User.create({
      name, email, password: hash,
    })
      .then((user) => {
        res.status(201).send({
          name: user.name,
          email: user.email,
        });
      })
      .catch((error) => {
        if (error.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует.'));
        } else if (error instanceof ValidationError) {
          next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        } else {
          next(error);
        }
      });
  });
};

// Обновление данных user
const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;

  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден.'))
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(error);
      }
    });
};

// Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Неправильные почта или пароль'))

    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((validUser) => {
          if (validUser) {
            // создадим токен
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
              { expiresIn: '7d' },
            );

            // вернём токен
            res.send({ token });
          } else {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

// Получить данные о пользователе
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((error) => next(error));
};

module.exports = {
  createUser,
  updateUser,
  login,
  getUserInfo,
};
