const routerCards = require('express').Router();
const auth = require('../middelewares/auth');

const {
  getAllCards, createCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', auth, getAllCards);

routerCards.delete('/cards/:cardId', auth, delCard);

routerCards.put('/cards/:cardId/likes', auth, likeCard);

routerCards.delete('/cards/:cardId/likes', auth, dislikeCard);

routerCards.post('/cards', auth, createCard);

module.exports = routerCards;