import { verify } from 'jsonwebtoken';

import UnauthorizedError from '../error/unauthorized-errors';

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
export default (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};