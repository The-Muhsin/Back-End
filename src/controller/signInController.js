const User = require('../models/user');
const bcrypt = require('bcrypt');

const signInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored hashed password:', user.password); // Added this line for debugging

   const rror=  bcrypt.compare(password, user.password)
      .then(passwordMatch => {
        console.log('Password Match Result:', passwordMatch); // Added this line for debugging

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid Password', rror  });
        }

        res.status(200).json({ message: 'User signed in successfully', user });
      })
      .catch(error => {
        console.error('Error during password comparison:', error);
        res.status(500).json({ message: 'An error occurred during password comparison', error: error.message });
      });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = signInController;