// signUpController.js

const User = require('../models/user');

const signUpController = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = signUpController;