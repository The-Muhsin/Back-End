const User = require('../models/user');
const bcrypt = require('bcrypt');

const signInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    res.status(200).json({ message: 'User signed in successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = signInController;
