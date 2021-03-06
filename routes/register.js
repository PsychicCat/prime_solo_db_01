var express = require('express');
var router = express.Router();
var Users = require('../models/user');

router.get('/', function(req,res,next){
    res.render('register');
});

router.post('/', function(req,res,next){
   Users.create(req.body, function(err,post){
       if(err){
           next(err);
       } else {
           res.redirect('/users');
       }
   })
});

module.exports = router;