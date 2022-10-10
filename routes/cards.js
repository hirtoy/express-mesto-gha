import { celebrate, Joi } from 'celebrate';
import auth from '../middelewares/auth';
import { validate } from '../utils/validate';
// import { validateUrl } from '../utils/validateUrl';

import {
  getAllCards, createCard, delCard, likeCard, dislikeCard,
} from '../controllers/cards';

const routerCards = require('express').Router();

routerCards.get('/cards', auth, getAllCards);

routerCards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(validate, 'ObjectId validation'),
  }),
}), auth, delCard);

routerCards.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(validate, 'ObjectId validation'),
  }),
}), auth, likeCard);

routerCards.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(validate, 'ObjectId validation'),
  }),
}), auth, dislikeCard);

routerCards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m).required(),
  }),
}), auth, createCard);

export default routerCards;