// REST API router from sample

const User = require('../models/User');
const Exercise = require('../models/Exercise');

const router = require('express').Router();

// @route  POST /api/exercise/new-user
// @desc   Create new user

router.post("/new-user", (req, res, next) => {
  const user = new User(req.body);
  
  user.save((err, savedUser) => {
    if(err) {
      if(err.code == 11000) {
        // uniqueness error (no custom message)
        return next({
          status: 400,
          message: 'username already taken'
        })
      } else {
        return next(err)
      }
    }

    res.json({
      username: savedUser.username,
      _id: savedUser._id
    });
  });
});

// @route  GET /api/exercise/users
// @desc   Get all users

router.get('/users', (req,res,next) => {
  User.find({}, (err, data) => {
    res.json(data)
  })
});

// @route  POST /api/exercise/add
// @desc   Create new exercise

router.post('/add', (req, res, next) => {
  User.findById(req.body.userId, (err, user) => {
    if(err) return next(err)
    if(!user) {
      return next({
        status: 400,
        message: 'unknown _id'
      })
    }
    const exercise = new Exercise(req.body)
    exercise.username = user.username
    exercise.save((err, savedExercise) => {
      if(err) return next(err)
      savedExercise = savedExercise.toObject()
      delete savedExercise.__v
      savedExercise._id = savedExercise.userId
      delete savedExercise.userId
      savedExercise.date = (new Date(savedExercise.date)).toDateString()
      res.json(savedExercise)
    })
  })
});

// @route  GET /api/exercise/log?{userId}[&from][&to][&limit]
// @desc   Get log of user's exercises

router.get('/log', (req, res, next) => {
  const from = new Date(req.query.from)
  const to = new Date(req.query.to)
  console.log(req.query.userId)
  User.findById(req.query.userId, (err, user) => {
    if(err) return next(err);
    if(!user) {
      return next({status:400, message: 'unknown userId'})
    }
    console.log(user)
    Exercise.find({
      userId: req.query.userId,
        date: {
          $lt: to.getTime() || Date.now() ,
          $gt: from.getTime() || 0
        }
      }, {
        __v: 0,
        _id: 0
      })
    .sort('-date')
    .limit(parseInt(req.query.limit))
    .exec((err, exercises) => {
      if(err) return next(err)
      const out = {
          _id: req.query.userId,
          username: user.username,
          from : from != 'Invalid Date' ? from.toDateString() : undefined,
          to : to != 'Invalid Date' ? to.toDateString(): undefined,
          count: exercises.length,
          log: exercises.map(e => ({
            description : e.description,
            duration : e.duration,
            date: e.date.toDateString()
          })
        )
      }
      res.json(out)
    })
  })
})

module.exports = router;