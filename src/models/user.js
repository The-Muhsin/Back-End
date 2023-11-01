const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date
});




//Generate Password Reset Token and Expiration Date

userSchema.methods.generatePasswordToken = function(){
this.resetToken = crypto.randonBytes(20).toString('hex');
this.resetTokemExpiration =  Date.now() + 3600000;
}
//Hashing the user password before saving it to the db

userSchema.pre('save', async function (next) {
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
    }
  else {
    return next();
  }
});

module.exports = mongoose.model('User', userSchema);
