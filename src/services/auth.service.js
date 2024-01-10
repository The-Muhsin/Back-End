const bcrypt = require('bcrypt');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

JWTSecret = process.env.JWT_SECRET;

const AuthService = {
    async register(body) {
      const { email, phoneNumber, password } = body;

        try {
            const user = await User.create({ email, phoneNumber, password }); //you have a method to hash passwords automatically n your schema
            
            return {user,message:"user created successfully"};
        } catch (error) {
            return error;
        }
    },

    async login(body) {
        try {
            const { email, password } = body;
            const user = await User.findOne({ email });
            if (!user) throw new Error({message:'User not found', status: 404});

            const isMatch = await user.isPasswordMatch(password);
            if (!isMatch) throw new Error({message:'Invalid password', status: 401});
            
            const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                data: {
                  id: user.id,
                  email: user.email
                },
              },
              JWTSecret,
            );

            return {token,message:"user logged in successfully"};
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(body) {
        try {
            const { email } = body;
            const user = await User.findOne({ email });
            if (!user) throw new Error({message: 'User not found', status: 404});

            user.generatePasswordToken();
            await user.save();
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
                
                throw new Error({ message: 'Failed to send reset email', status: 500 });
              } else {
                console.log('Email sent: ' + info.response);
                return { message: 'Reset email sent successfully' };
              }
            });
            return {message:"reset token sent successfully"}
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;