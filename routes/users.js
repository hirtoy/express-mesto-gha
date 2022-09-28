const routerUser = require('express').Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  createUser,
} = require('../controllers/users');

routerUser.post('/users/signin', login);
routerUser.post('/users/signup', createUser);
routerUser.get('/users', getAllUsers);
routerUser.get('/users/:userId', getUser);
routerUser.patch('/users/me', updateUser);
routerUser.patch('/users/me/avatar', updateAvatar);

module.exports = routerUser;