// eslint-disable-next-line import/no-unresolved
import { compare } from 'bcryptjs';
import {
  find, findById, create, findOne, findByIdAndUpdate,
} from '../models/user';

import {
  STATUS_CREATED, STATUS_NOT_FOUND, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR,
} from '../utils/constants';

export function getAllUsers(req, res) {
  find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' }));
}

export function getUser(req, res) {
  const { userId } = req.params;
  findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: 'The requested user not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Id is incorrect' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error is occured' });
      }
    });
}

export function createUser(req, res) {
  const { name, about, avatar } = req.body;
  create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Inccorrect data passed during user creation' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
}

export function login(req, res) {
  const { email, password } = req.body;

  findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return compare(password, user.password);
    })
    // eslint-disable-next-line consistent-return
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // аутентификация успешна
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}

export function updateUser(req, res) {
  const userId = req.user._id;
  const { name, about } = req.body;
  findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: `User ID ${userId} is not found` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'User ID is incorrect',
          });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
}

export function updateAvatar(req, res) {
  const userId = req.user._id;
  const { avatar } = req.body;
  findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: `Пользователь ${userId} не найден` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Неверные данные пользователя' });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'User ID is incorrect',
          });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
}