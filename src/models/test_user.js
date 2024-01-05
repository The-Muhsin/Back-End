const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
});

// Generate Password Reset Token and Expiration Date
userSchema.methods.generatePasswordResetToken = function() {
  this.resetToken = crypto.randomBytes(20).toString('hex');
  this.resetTokenExpiration = Date.now() + 3600000; // 1 hour
};

// Hash the user password before saving it to the db
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
});

module.exports = mongoose.model('User', userSchema);