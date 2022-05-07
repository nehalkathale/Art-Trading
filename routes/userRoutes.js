const express = require('express');
const controller = require('../controllers/userController');
const {loginLimiter} = require('../middleware/rateLimiter');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const {validateSignUp,validateLogin,validateResult} = require('../middleware/validator')

const router = express.Router();

router.get('/new',isGuest, controller.new);
router.get('/login',isGuest, controller.login);
router.get('/profile',isLoggedIn, controller.profile);
router.get('/logout',isLoggedIn, controller.logout);
router.post('/new',isGuest,validateSignUp,validateResult,controller.addUser);
router.post('/login',loginLimiter,isGuest,validateLogin,validateResult,controller.loginUser);
router.get('/watchList',isLoggedIn,controller.userWatchList)

module.exports = router;
