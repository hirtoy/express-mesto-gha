const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// временный позьзователь
app.use((req, res, next) => {
  req.user = {
    _id: '631b9b37bfc4eaa93a13a06a',
  };
  next();
});

app.use(routerUser);
app.use(routerCards);
app.all('/*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Неверный запрос' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-undef
  myConsole.log(`Сервер запущен на порту ${PORT}`);
});