const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { validate } = require('../utils/validate');
// const bodyParser = require('body-parser');
const auth = require('../middelewares/auth');

const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  createUser,
  getUserInfo,
// eslint-disable-next-line import/order
} = require('../controllers/users');

routerUser.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routerUser.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m),
  }),
}), createUser);

routerUser.get('/users', auth, getAllUsers);

routerUser.get('/users/me', auth, getUserInfo);

routerUser.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), auth, getUser);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUser);

routerUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m)
      .required(),
  }),
}), auth, updateAvatar);

module.exports = routerUser;