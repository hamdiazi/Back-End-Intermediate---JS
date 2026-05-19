const express = require ('express');
const router = express.Router();
const User = require ('../models/user');
const AuthController = require('../controllers/auth'); //memanggil controller > auth.js
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.route('/register')
// route untuk ke form register 
.get(AuthController.registerform)
// router post agar bisa create user di form register
.post(wrapAsync(AuthController.registerUser))


// route untuk ke form login 
router.route('/login')
.get( AuthController.loginForm)
// fungsi untuk login 
.post(passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash: {
        type: 'error_msg',
        msg:'Invalid username or password'
    }
}), AuthController.login)

// fungsi untuk log out 
router.post('/logout', AuthController.logout)

module.exports = router