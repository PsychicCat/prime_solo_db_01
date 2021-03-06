var express = require('express');
var router = express.Router();
var async = require('async');
var nodemailer = require('nodemailer');
var User = require('../models/user');

router.get('/:token', function(req,res,next){
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
        if(!user) {
            req.flash('error', 'Password reset token is invalid or expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user
        })
    })
});

router.post('/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    req.logIn(user, function(err) {
                        done(err, user);
                    });
                });
            });
        },
        function(user, done) {
            var transport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'nodemailertest123@gmail.com',
                    pass: 'fakepassword'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            transport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

module.exports = router;

