const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

exports.signup = async (req, res) => {
  try {

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Password doesn't match with Confirm Password" });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res.status(409).json({ message: "User with given email id already exists!" });

    user = await new User(req.body).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
    }).save();

    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res.status(401).json({ message: "An email sent to your account please verify" });

  } catch (error) {
    console.error('Error in signup', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

exports.verifyUserAccountLink = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });

    if (!token) return res.status(400).json({ message: "Invalid Link" });

    await User.updateOne({_id: user._id}, {verified: true});

    await token.deleteOne();

    res.status(200).json({ message: "Email Verified Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(401).json({ message: "Invalid Email or Password" });

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id })
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex")
        }).save();
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return res.status(400).json({ message: "An Email sent to your account please verify" });
    }

    const token = user.createToken();
    res.status(200).json({ email: user.email, token: token, message: "logged in successfully" });

  } catch (error) {
    console.error('Error in login!', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

exports.verifyEmail = async (req, res) => {

  try {

    let user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(409).json({ message: "User with given email does not exist" });

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
      }).save();
    }

    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password Reset", url);

    res.status(200).json({ message: "Password reset link sent to your email account" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

exports.verifyPasswordResetLink = async (req, res) => {

  try {

    const user = await User.findOne({ _id: req.params.id });

    if (!user)
      return res.status(400).json({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });

    if (!token)
      return res.status(400).json({ message: "Invalid Link" });

    res.status(200).json({ message: "Valid URL" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

exports.passwordReset = async (req, res) => {

  try {

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Password doesn't match with Confirm Password" });
    }

    const user = await User.findOne({ _id: req.params.id });

    if (!user)
      return res.status(400).json({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });

    if (!token)
      return res.status(400).status({ message: "Invalid Link" });

    if (!user.verified)
      user.verified = true;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashPassword;

    await user.save();
    await token.deleteOne();

    res.status(200).json({ message: "Password Reset Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}
