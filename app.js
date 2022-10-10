const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('./middelewares/auth');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFoundError = require('./error/not-found-errors');
const { handleError } = require('./utils/handleError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(routerUser);
app.use(routerCards);
app.use(errors());

app.all('/*', auth, () => {
  throw new NotFoundError({ message: 'Неверный запрос' });
});
app.use(handleError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-undef, no-console
  console.log(`Сервер запущен на порту ${PORT}`);
});