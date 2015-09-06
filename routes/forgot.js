var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    var message = req.flash();
    res.render('forgot', { user: req.user , message: message});
});

router.post('/', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'nodemailertest123@gmail.com',
                    pass: 'fakepassword'
                }
            });
            var mailOptions = {
                to: {name: user.firstname + " " + user.lastname, address: user.email },
                from: 'Brendan Telzrow <nodemailertest123@gmail.com>',
                subject: 'Very Secure Website Password Reset',
                text: 'You are receiving this because you (or someone else) has requested to reset the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});


module.exports = router;