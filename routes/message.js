var express = require('express');
var router = express.Router();
var Messages = require('../models/message.js');

router.get('/', function(req,res,next){
    if(req.isAuthenticated()){
        Messages.find({}, function(err, messages){
            if(err){
                console.log(err);
            } else {
                res.render('message', { messages: messages, user: req.user });
            }
        });
    } else {
        res.redirect('/');
    }
});

router.post('/', function(req, res, next){
   if(req.isAuthenticated()){
       Messages.create({user: req.user.firstname, message: req.body.value, date: Date.now()}, function(err,post){
           if(err){
               next(err);
           } else {
               res.render('message');
           }
       })
   } else {
    res.redirect('/');
   }
});

module.exports = router;