const router = require('express').Router();

const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

// Получения информации о пользователе
router.get('/me', getUserInfo);

// Обновление данных
router.patch('/me', updateUser);

module.exports = router;
