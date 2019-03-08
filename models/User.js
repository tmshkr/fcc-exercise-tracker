const shortid = require('shortid')
const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
  },
  created: {
    type: Number,
    default: Date.now
  }
})

User.statics.findAll = function() {
  return this.find().sort("-created")
}

User.statics.findByUsername = function(username) {
  return this.findOne({ username })
}

User.statics.newUser = function(username) {
  const user = new this({ username })
  return user.save().catch(err => ({ error: { code: err.code }}))
}


module.exports = mongoose.model('User', User)