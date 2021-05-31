const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("./Token");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      maxLength: 280,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profileImageUrl: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "basic",
      enum: ["basic", "supervisor", "admin", "expert"],
    },
    tags: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  createAccessToken: async function () {
    try {
      let { _id } = this;
      let accessToken = jwt.sign(
        { user: { userId: _id } },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "3d",
        }
      );
      return accessToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      let { _id } = this;
      let refreshToken = jwt.sign(
        { user: { userId: _id } },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

//pre save hook to hash password before saving user into the database:
userSchema.pre("save", async function (next) {
  try {
    let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
    let hashedPassword = await bcrypt.hash(this.password, salt); // hash the current user's password
    this.password = hashedPassword;
  } catch (error) {
    console.error(error);
  }
  return next();
});

module.exports = mongoose.model("User", userSchema);
