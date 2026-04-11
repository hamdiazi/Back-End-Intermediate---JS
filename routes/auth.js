const express = require ('express');
const router = express.Router();
const User = require ('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

// route untuk ke form register 
router.get('/register', (req, res) => {
    res.render('auth/register');
})

// router post agar bisa create user di form register
router.post('/register', wrapAsync(async (req,res) => {
    // res.send(req.body);
    try {
        const {email, username, password} = req.body;
        const user = new User ({email, username});
        await User.register(user, password);
        req.flash('success_msg', 'You are registered  and can log in');
        res.redirect('/login');
    } catch (error) {     
        req.flash('error_msg', error.message);
        res.redirect('/register');
    }
}))

// route untuk ke form login 
router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash: {
        type: 'error_msg',
        msg:'Invalid username or password'
    }
}), (req, res) => {
    req.flash('success_msg','You are logged in');
    res.redirect('/places');
})




module.exports = router