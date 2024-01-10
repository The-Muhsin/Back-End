const AuthService = require('../services/auth.service');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');
const { registerValidation, loginValidation } = require('../validation/auth.validation');


const authController = {
  async register(req, res) {
    const { error } = registerValidation(req.body);
    if (error) return sendErrorResponse(res, error.details[0].message, 400);

    try {
      const user = await AuthService.register(req.body);
      return sendSuccessResponse(res, user, 201);
    } catch (error) {
      return sendErrorResponse(res, error.message, 500);
    }
  },
  async login(req, res) {
    const { error } = loginValidation(req.body);
    if (error) return sendErrorResponse(res, error.details[0].message, 400);

    try {
      const token = await AuthService.login(req.body);
      return sendSuccessResponse(res, token, 200);
    } catch (error) {
      return sendErrorResponse(res, error.message, 400);
    }
  },

  async refreshToken(req, res) {
    try {
      const token = await AuthService.resetPassword(req.body);
      return sendSuccessResponse(res, token, 200);
    } catch (error) {
      return sendErrorResponse(res, error.message, error.status);
    }
  },
};



module.exports = authController;