const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../error/bad-request-errors');
const EmailExistError = require('../error/email-exist-errors');
const NotFoundError = require('../error/not-found-errors');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Не верные данные пользователя'));
      }
      next(error);
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Не верные данные пользователя' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError({ message: 'Не верные данные пользователя' }));
      } else next(error);
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
    .then(() => res.status(200).send({
      name, about, avatar, email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else if (error.code === 11000) {
        next(new EmailExistError(`Пользователь с почтой ${email} не найден`));
      } else next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
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
        throw new NotFoundError({ message: `Пользователь ${userId} не найден` });
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Не верные данные пользователя' }));
      } else next(error);
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
        throw new NotFoundError({ message: `Пользователь ${userId} не найден` });
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Неверные данные пользователя' }));
      } else next(error);
    });
};