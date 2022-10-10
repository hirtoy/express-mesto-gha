const Card = require('../models/card').default;
const BadRequestError = require('../error/bad-request-errors');
const ForbiddenError = require('../error/forbidden-errors');
const NotFoundError = require('../error/not-found-errors');

// отображение карточек на странице
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// создание карточки
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new BadRequestError('Неверные данные'));
      } else next(error);
    });
};

// удаление карточки
module.exports.delCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Удаление карточки с несуществующим id');
      } else if (JSON.stringify(req.user._id) === JSON.stringify(card.owner)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((delcard) => res.status(200).send(delcard));
      } else {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(error);
    });
};

// лайк карточки
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавляем _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // eslint-disable-next-line new-cap
        throw new NotFoundError('Не верный запрос');
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не найдена'));
      } else next(error);
    });
};

// убрать лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убираем _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не верный запрос');
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не найдена'));
      } else next(error);
    });
};