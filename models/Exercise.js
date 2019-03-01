const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Exercise = new Schema({
  description: {
    type: String,
    required: true,
    maxlength: [20, 'description too long']
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'duration too short']
  },
  date: {
    type: Date,
    default: Date.now()
  },
  username: String,
  userId: {
    type: String,
    ref: 'User',
    index: true
  }
});

Exercise.statics.findByUserId = function(userId, args) {
  const { from, to, limit } = args
  return this.find({
    userId,
    date: {
      $gt: from ? new Date(from) : 0,
      $lt: to ? new Date(to) : Date.now()
    }})
    .limit(limit)
}

// validate userId, and add "username" to the exercise instance
Exercise.pre('save', function(next) {
  mongoose.model('User').findById(this.userId, (err, user) => {
    if(err) return next(err)
    if(!user) {
      const err = new Error('unknown userId')
      err.status = 400
      return next(err)
    }
    this.username = user.username
    if(!this.date) {
      this.date = Date.now()
    }
    next();
  });
});


module.exports = mongoose.model('Exercise', Exercise);