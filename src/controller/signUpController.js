// signUpController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');

const signUpController = async (req, res) => {
  const { email, phoneNumber, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    console.log('Hashed password before storing:', hashedPassword); // Add this line for debugging
    const user = await User.create({ email, phoneNumber, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = signUpController;
