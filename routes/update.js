var express = require('express');
var router = express.Router();
var Users = require('../models/user');
var Messages = require('../models/message');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
        Users.find({}, function(err, users){
            if(err){
                console.log(err);
            } else {
                users.forEach(function(user){
                    user.password = undefined;
                    user.loginAttempts = undefined;
                });
                res.send({users: users});
            }
        });
    } else {
        res.sendStatus(500);
    }
});

router.get('/messages', function(req, res, next) {
    if(req.isAuthenticated()){
        Messages.find({}, function(err, messages){
            if(err){
                console.log(err);
            } else {
                res.send({message: messages});
            }
        });
    } else {
        res.sendStatus(500);
    }
});

module.exports = router;