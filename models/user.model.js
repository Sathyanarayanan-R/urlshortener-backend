const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: {type: Boolean, default: false}
});

userSchema.methods.createToken = function () {
  try {
    const { JWT_PRIVATE_KEY } = process.env;
    return jwt.sign({ _id: this._id }, JWT_PRIVATE_KEY, {
       expiresIn: "7d"
    });
  } catch (error) {
    console.error('Error in jwt generation', error);
  }
};

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }

    return next();
  } catch (error) {
    console.error('Error in password hashing!', error);
  }
});

module.exports = mongoose.model('User', userSchema, "users-day40");
