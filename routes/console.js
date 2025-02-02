const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {consolePage} = require('../controllers/console');

const router = express.Router();

// GET /consolePage
router.get('/', isLoggedIn, consolePage);


module.exports = router;