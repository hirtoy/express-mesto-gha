const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middelewares/auth');
const { validate } = require('../utils/validate');
const regex = require('../utils/regex');

const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  createUser,
  getUserInfo,
} = require('../controllers/users');

routerUser.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

routerUser.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
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
    avatar: Joi.string().required().pattern(regex),
  }),
}), auth, updateAvatar);

module.exports = routerUser;