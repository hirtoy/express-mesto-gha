const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const routerUser = require('express').Router();
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

const { validate } = require('../utils/validate');
const { validateUrl } = require('../utils/validateUrl');

routerUser.use(bodyParser.json());
routerUser.use(bodyParser.urlencoded({ extended: true }));

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
      .pattern(validateUrl),
  }),
}), createUser);

routerUser.get('/users', getAllUsers);

routerUser.get('/users/me', getUserInfo);

routerUser.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validate, 'ObjectId validation'),
  }),
}), getUser);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

routerUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(validateUrl)
      .required(),
  }),
}), updateAvatar);

module.exports = routerUser;