
const User = require('../models/user');
const bcrypt = require('bcrypt');

const signInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // At this point, the user is authenticated
    // You can implement a session or token-based authentication here
    // For example, generate and send a JWT token

    // Respond with a success message and the user data (excluding the password)
    res.status(200).json({ message: 'Sign-in successful', user: { email: user.email, username: user.username } });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = signInController;
