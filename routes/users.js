const routerUser = require('express').Router();
const auth = require('../middelewares/auth');

const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  createUser,
  getUserInfo,
} = require('../controllers/users');

routerUser.post('/users/signin', login);
routerUser.post('/users/signup', createUser);
routerUser.get('/users', auth, getAllUsers);
routerUser.get('/users/:userId', getUser);
routerUser.get('/users/me', auth, getUserInfo);
routerUser.patch('/users/me', auth, updateUser);
routerUser.patch('/users/me/avatar', auth, updateAvatar);

module.exports = routerUser;