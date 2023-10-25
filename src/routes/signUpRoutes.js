// signUpRoutes.js

const express = require('express');
const router = express.Router();
const signUpController = require('../controller/signUpController');

router.post('/signup', signUpController);

module.exports = router;
