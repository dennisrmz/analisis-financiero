const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
// SIGNUP
router.get('/signup', isLoggedIn, (req, res) => {
        res.render('authentication/signup');
});

router.post('/signup', isLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res, next) => {
        res.render('authentication/signin');
});
router.post('/signin',(req, res, next) => {
        passport.authenticate('local.signin', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
        })(req, res, next);
    });

router.get('/logout',(req, res) => {
        req.logOut();
        res.redirect('/signin');
});
    
    
module.exports = router;