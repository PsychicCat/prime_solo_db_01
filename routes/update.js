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

module.exports = router;