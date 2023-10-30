const express = require('express');
const router = express.Router();
const signInController = require('../controller/signInController');

// Define the route for user sign-in
router.post('/signin', signInController);

module.exports = router;
