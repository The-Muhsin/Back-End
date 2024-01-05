//routes/forgetPasswordRoutes.js

const router = require('express');
const controller = require('../controller/forgetPasswordController');

router.post('/forgetPassword', controller.requestForgetPassword);
router.post('resetPassword/:token', controller.resetPassword);

module.exports = router;