const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const {
  GOOGLE_OAUTH_CLIENT_ID,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  EMAIL_TOKEN_SECRET,
  EMAIL_CLIENT_USER,
  EMAIL_CLIENT_PASSWORD,
} = process.env;
const client = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);
const errorHandler = require("../helpers/dbErrorHandler");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_CLIENT_USER, // generated ethereal user
    pass: EMAIL_CLIENT_PASSWORD, // generated ethereal password
  },
});

exports.registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "This email is already in use" });
    } else {
      user = await new User(req.body).save();
      const userId = user._id;

      const emailVerifyToken = jwt.sign(
        { user: { _id: userId } },
        EMAIL_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const emailVerificationLink = `http://localhost:5000/auth/verify-email/${emailVerifyToken}`;

      transporter.sendMail({
        from: EMAIL_CLIENT_USER,
        to: email,
        subject: "Thanks for signing up.",
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          emailVerificationLink +
          ">Click here to verify</a>",
      });

      const accessToken = await user.createAccessToken();
      const refreshToken = await user.createRefreshToken();
      return res.status(201).json({ accessToken, refreshToken, userId });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { emailToken } = req.params;
    const payload = jwt.verify(emailToken, EMAIL_TOKEN_SECRET);
    const userId = payload.user._id;
    await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    return res.status(500).json({ message: "Email verified" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.resendVerifyEmail = async (req, res) => {
  try {
    const { userId } = req.user;
    const emailVerifyToken = jwt.sign(
      { user: { userId } },
      EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const emailVerificationLink = `http://localhost:5000/auth/verify-email/${emailVerifyToken}`;
    const user = await User.findById(userId);
    transporter.sendMail({
      from: EMAIL_CLIENT_USER,
      to: user.email,
      subject: "Resent email",
      html:
        "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
        emailVerificationLink +
        ">Click here to verify</a>",
    });
    return res.status(200).json({ message: "Email sent again" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    } else {
      let valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const userId = user._id;
        const accessToken = await user.createAccessToken();
        const refreshToken = await user.createRefreshToken();

        return res.status(201).json({ accessToken, refreshToken, userId });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    const doesUserExit = await User.exists({ email });
    let savedUser = {};

    if (!doesUserExit) {
      const user = new User({
        name,
        email,
        profileImageUrl: picture,
        password: "randomPassword1",
        isEmailVerified: true,
      });
      savedUser = await user.save();
    } else {
      savedUser = await User.findOne({
        email: email,
      }).exec();
    }
    const userId = savedUser._id;
    const accessToken = await savedUser.createAccessToken();
    const refreshToken = await savedUser.createRefreshToken();
    return res.status(201).json({
      userId,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ error: "Access denied, Token missing" });
    } else {
      const tokenDoc = await Token.findOne({ token: refreshToken });
      if (!tokenDoc) {
        return res.status(401).json({ error: "Token expired" });
      } else {
        const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign(
          { user: payload.user },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10m",
          }
        );
        return res.status(200).json({ accessToken });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await Token.findOneAndDelete({ token: refreshToken });
    return res.status(200).json({ success: "User logged out" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
