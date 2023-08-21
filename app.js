const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const router = require('./routes');

const handleErrors = require('./middlewares/handleErrors');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

/* const { PORT, DB_URL } = require('./utils/constant'); */

const app = express();

app.use(helmet());

app.use(bodyParser.json());

mongoose.connect(DB_URL);

/* mongoose.connect(DB_URL, () => {
  console.log('БД успешно подключена');
});
 */

app.use(router);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен! Порт ${PORT}`);
});
