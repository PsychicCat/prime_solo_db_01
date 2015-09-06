var express = require('express');
var router = express.Router();
var Users = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if(req.isAuthenticated()){
    Users.find({}, function(err, users){
      if(err){
        console.log(err);
      } else {
        res.render('users', { users : users, user: req.user});
      }
    });
  } else {
    res.render('index');
  }
});

router.delete('/:id', function(req,res,next){
  Users.findByIdAndRemove(req.params.id, function(err, user){
    if(err){
      console.log(err);
      next(err);
    } else {
      res.sendStatus(200);
    }
  })
});

router.put('/:id', function(req,res,next){
  Users.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    if(err){
      console.log(err);
      next(err);
    } else {
      res.sendStatus(200);
    }
  })
});

module.exports = router;
