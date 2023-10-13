const router = require('express').Router();

const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

// Получения информации о пользователе
router.get('/users/me', getUserInfo);

// Обновление данных
router.patch('/users/me', updateUser); // обновляет информацию о пользователе (email и name)

module.exports = router;
