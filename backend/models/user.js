const { Schema, model } = require("mongoose");

const userSchemma = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 30,
    lowercase: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const User = model("User", userSchemma);

module.exports = User;
