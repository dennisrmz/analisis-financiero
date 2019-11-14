const express = require('express');
const router = express.Router();

const pool = require('../database');

// SINGIN
router.get('/signin', (req, res) => {
        res.render('authentication/signin');
});
router.post('/signin', (req, res) =>{
        res.redirect('/');
}); 

// SIGNUP
router.get('/signup', (req, res) => {
        res.render('authentication/signup');
});
router.post('/signup', (req, res) =>{
        res.redirect('/signin');
}); 

module.exports = router;