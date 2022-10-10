const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line import/order
const { validate } = require('../utils/validate');
// const bodyParser = require('body-parser');
const routerUser = require('express').Router();
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

// routerUser.use(bodyParser.json());
// routerUser.use(bodyParser.urlencoded({ extended: true }));

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
    userId: Joi.string().custom(validate, 'ObjectId validation'),
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