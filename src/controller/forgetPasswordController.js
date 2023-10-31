const nodemailer = require('nodemailer');



    const forgotPasswordController = async (req, res) => {
        const { email } = req.body;
        // Implement your logic here for generating a unique reset token
      
        // Use Nodemailer to send the reset password link to the user's email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'your_email@gmail.com',
            pass: 'your_password',
          },
        });
      
        const mailOptions = {
          from: 'your_email@gmail.com',
          to: email,
          subject: 'Reset Your Password',
          text: 'Click on the link to reset your password: reset_link_here',
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
      };
      
      module.exports = forgotPasswordController;
      
      // Add the route in app.js
      const forgotPasswordController = require('./path_to_forgotPasswordController');
      
      //...
      
      app.post('/api/forgotPassword', forgotPasswordController);
      
