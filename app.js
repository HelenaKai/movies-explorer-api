const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT, DB_URL } = require('./utils/constant');

const app = express();

app.use(bodyParser.json());

/* mongoose.connect(DB_URL); */

mongoose.connect(DB_URL, () => {
  console.log('БД успешно подключена');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен! Порт ${PORT}`);
});
