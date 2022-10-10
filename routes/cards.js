const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middelewares/auth');
const { validate } = require('../utils/validate');

const {
  getAllCards, createCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards');

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
    link: Joi
      .string()
      .regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m)
      .required(),
  }),
}), auth, createCard);

export default routerCards;