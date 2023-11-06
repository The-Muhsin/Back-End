// forgotPasswordController.js
const nodemailer = require('nodemailer');
const User = require('../models/user');


const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.generatePasswordResetToken();
    await user.save();

    const resetLink = `https://muhsin-test.onrender.com/resetPassword/${user.resetToken}`;
    
    // Use Nodemailer to send the reset password link to the user's email
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
      text: `Click on the link to reset your password: ${resetLink}`,
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
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


module.exports = forgotPasswordController;

