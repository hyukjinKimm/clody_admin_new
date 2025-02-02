const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {loginPage, login} = require('../controllers/auth');

const router = express.Router();

// GET /loginPage
router.get('/', isNotLoggedIn, loginPage);

// POST /login
router.post('/login', isNotLoggedIn, login);



module.exports = router;