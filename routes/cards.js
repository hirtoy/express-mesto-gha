const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middelewares/auth');
const { validate } = require('../utils/validate');
const { validateUrl } = require('../utils/validateUrl');

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
    link: Joi.string().required().pattern(validateUrl),
  }),
}), auth, createCard);

module.exports = routerCards;