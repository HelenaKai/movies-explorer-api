const router = require('express').Router();

const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

const { validationUpdateUser } = require('../middlewares/validation');

// Получения информации о пользователе
router.get('/me', getUserInfo);

// Обновление данных
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
