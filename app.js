const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users').default;
const routerCards = require('./routes/cards').default;
const NotFoundError = require('./error/not-found-errors');
const { handleError } = require('./utils/handleError').default;

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(routerUser);
app.use(routerCards);
app.use(errors());

app.all('/*', () => {
  throw new NotFoundError({ message: 'Неверный запрос' });
});
app.use(handleError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-undef, no-console
  console.log(`Сервер запущен на порту ${PORT}`);
});