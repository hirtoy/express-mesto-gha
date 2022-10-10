import { celebrate, Joi } from 'celebrate';
import auth from '../middelewares/auth';
import { validate } from '../utils/validate';
// import { validateUrl } from '../utils/validateUrl';

import {
  getAllUsers, getUser, updateUser, updateAvatar, login, createUser, getUserInfo,
} from '../controllers/users';

const routerUser = require('express').Router();

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
    avatar: Joi.string().regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m).required(),
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
    avatar: Joi.string().required().regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m).required(),
  }),
}), auth, updateAvatar);

export default routerUser;