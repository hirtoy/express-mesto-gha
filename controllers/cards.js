const Card = require('../models/card');

const {
  STATUS_CREATED, STATUS_NOT_FOUND, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

// отображение карточек на странице
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// создание карточки
module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.status(STATUS_CREATED).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Неверные данные' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// удаление карточки
module.exports.delCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Идентификатор карты неверен' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: `Карточка ${cardId} не кореектна` });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// лайк карточки
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавляем _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(STATUS_NOT_FOUND).send({ message: 'Карточка запроса не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(STATUS_BAD_REQUEST).send({ message: 'Идентификатор карты неверен' });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  });

// убрать лайк
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убираем _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(STATUS_NOT_FOUND).send({ message: 'Карточка запроса не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(STATUS_BAD_REQUEST).send({ message: 'Идентификатор карты неверен' });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  });