const Card = require('../models/card');
const badRequestError = require('../error/bad-request-errors');
const notFoundError = require('../error/not-found-errors');
// eslint-disable-next-line import/no-unresolved
const forbiddenError = require('../error/forbidden-errors');

const {
  STATUS_CREATED, STATUS_OK,
} = require('../utils/constants');

// отображение карточек на странице
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    .catch((error) => { throw error; })
    .catch(next);
};

// создание карточки
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.status(STATUS_CREATED).send({ data: cards }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new badRequestError('Неверные данные'));
        return;
      }
      next(error);
    });
};

// удаление карточки
module.exports.delCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      // eslint-disable-next-line new-cap
      if (!card) { throw new notFoundError('Карточка не найдена'); }
      // eslint-disable-next-line eqeqeq, new-cap
      if (card.owner != req.user._id) { throw new forbiddenError('Вы не можете удалить чужую карточку'); }
      return card.remove();
    })
    .then(() => {
      res.status(STATUS_OK).send({ message: `Карточка ${cardId} не кореектна` });
    })
    .catch(next);
};

// лайк карточки
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавляем _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      // eslint-disable-next-line new-cap
      throw new notFoundError('Не верный запрос');
    }
    res.status(STATUS_CREATED).send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      // eslint-disable-next-line new-cap
      next(new badRequestError('Карточка не найдена'));
      return;
    }
    next(error);
  });

// убрать лайк
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убираем _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      // eslint-disable-next-line new-cap
      throw new notFoundError('Не верный запрос');
    }
    res.status(STATUS_OK).send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      // eslint-disable-next-line new-cap
      next(new badRequestError('Карточка не найдена'));
      return;
    }
    next(error);
  });