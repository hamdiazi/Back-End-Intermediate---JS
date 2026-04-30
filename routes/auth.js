const express = require ('express');
const router = express.Router();
const User = require ('../models/user');
const AuthController = require('../controllers/auth'); //memanggil controller > auth.js
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

// route untuk ke form register 
router.get('/register', AuthController.registerform)

// router post agar bisa create user di form register
router.post('/register', wrapAsync(AuthController.registerUser))

// route untuk ke form login 
router.get('/login', AuthController.loginForm)

// fungsi untuk login 
router.post('/login', passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash: {
        type: 'error_msg',
        msg:'Invalid username or password'
    }
}), AuthController.login)

// fungsi untuk log out 
router.post('/logout', AuthController.logout)

module.exports = router