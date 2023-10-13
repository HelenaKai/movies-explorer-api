const router = require('express').Router();

const userRoutes = require('./users');
const movieRouter = require('./movies');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const { validationUserInfo, validationLogin } = require('../middlewares/validation');

const NotFoundError = require('../errors/notFoundError');

router.post('/signup', validationUserInfo, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/', userRoutes);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
