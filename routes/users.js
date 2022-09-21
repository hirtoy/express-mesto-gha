const routerUser = require('express').Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/users', getAllUsers);
routerUser.get('/users/:userId', getUser);
routerUser.post('/users', createUser);
routerUser.patch('/users/me', updateUser);
routerUser.patch('/users/me/avatar', updateAvatar);

module.exports = routerUser;