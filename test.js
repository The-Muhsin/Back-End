const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const User = require('./src/models/test_user'); // Assuming you have a User model defined
const connectDB = require('./db/dbConnection');

const app = express();
app.use(express.json());

app.post('/signup', [
  body('username').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  body('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  console.log(hashedPassword);
  await user.save();
  res.status(201).json({ message: 'User created' });
});

app.post('/signin', [
  body('username').exists(),
  body('password').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const passwordMatch = await bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    console.log('Password Match Result:', passwordMatch); // Added this line for debugging
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post('/forgotPassword', [
  body('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // Generate password reset token
  const resetToken = jwt.sign({ userId: user._id }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', { expiresIn: '1h' });

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'themuhsinweb@gmail.com',
        pass: '12AE579CA0BEA7D55C07D590B9E93D0BBA4C',
    },
  });

  const mailOptions = {
    from: 'themuhsinweb@gmail.com',
    to: email,
    subject: 'Reset Your Password',
    text: `Click on the link to reset your password: https://muhsin-test.onrender.com/resetPassword/${resetToken}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send reset email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Reset email sent successfully' });
    }
  });
});
connectDB();

app.listen(3000, () => console.log('Server running on port 3000'));