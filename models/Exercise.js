const shortid = require('shortid')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Exercise = new Schema({
  _id: {
    type: String,
    index: true,
    default: shortid.generate
  },
  title: {
    type: String,
    required: true,
    maxlength: [20, 'title too long']
  },
  description: {
    type: String,
    default: '',
    maxlength: [140, 'description too long']
  },
  duration: {
    type: Number,
    default: 0,
    min: [0, 'duration cannot be negative']
  },
  date: {
    type: Number,
    default: Date.now
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

Exercise.statics.findByUsername = function(username, args) {
  const { from, to, limit } = args
  return this.find({
    username,
    date: {
      $gt: from ? new Date(from) : 0,
      $lt: to ? new Date(to) : Date.now()
    }})
    .limit(limit)
}

Exercise.statics.addExercise = function(args) {
  const exercise = new this(args);
  return exercise.save();
}

Exercise.statics.editExercise = function(args) {
  return this.findByIdAndUpdate(args.id, { $set: args }, { new: true });
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
    next();
  });
});


module.exports = mongoose.model('Exercise', Exercise);