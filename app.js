require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');

const router = require('./routes');

const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, DB_URL } = require('./utils/constant');

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());

mongoose.connect(DB_URL);

app.use(requestLogger);

app.use(rateLimiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен! Порт ${PORT}`);
});
