const shortid = require('shortid');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Exercise = require("./Exercise");

const User = new Schema({
  username: {
    type: String, 
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
  },
  _id: {
    type: String,
    index: true,
    default: shortid.generate
  }
})

User.statics.findAll = function() {
  return this.find();
}

User.statics.getExercises = function(userId) {
  return Exercise.find({ userId });
}

module.exports = mongoose.model('User', User)