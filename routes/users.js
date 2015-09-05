var express = require('express');
var router = express.Router();
var Users = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    Users.find({}, function(err, users){
      if(err){
        console.log(err);
      } else {
        console.log(users);
        res.render('users', { users : users});
      }
    });
  } else {
    res.render('index');
  }
});

router.delete('/', function(req,res,next){

});

module.exports = router;
