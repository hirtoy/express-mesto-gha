const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const badRequestError = require('../error/bad-request-errors');
const emailExistError = require('../error/email-exist-errors');
const notFoundError = require('../error/not-found-errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.find({ _id })
    .then((user) => res.status(STATUS_OK).send({ data: user[0] }))
    .catch((error) => {
      throw error;
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line new-cap
        throw new notFoundError({ message: 'Не верные данные пользователя' });
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError({ message: 'Не верные данные пользователя' }));
        return;
      }
      next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => {
      const userWithOutPassword = user.toObject();
      delete userWithOutPassword.password;
      res.status(STATUS_CREATED).send(userWithOutPassword);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError(error.message));
        return;
      }
      if (error.code === 11000) {
        // eslint-disable-next-line new-cap
        next(new emailExistError(`Пользователь с почтой ${email} не найден`));
        return;
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(STATUS_OK).cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  // eslint-disable-next-line no-undef
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line new-cap
        throw new notFoundError({ message: `Пользователь ${userId} не найден` });
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError({ message: 'Не верные данные пользователя' }));
        return;
      }
      if (error.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError({ message: 'Не верные данные пользователя' }));
      }
      next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line new-cap
        throw new notFoundError({ message: `Пользователь ${userId} не найден` });
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError({ message: 'Неверные данные пользователя' }));
        return;
      }
      if (error.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError({ message: 'Неверные данные пользователя' }));
        return;
      }
      next(error);
    });
};