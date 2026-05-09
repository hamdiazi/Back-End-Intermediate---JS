const express = require('express');
const Place = require('../models/place');   // import models mongoose dari file place.js
const Review = require('../models/review');// import model review
const ReviewControllers = require('../controllers/reviews'); //memanggil atau import file controllers > review.js

const wrapAsync = require('../utils/wrapAsync')  //requeire untuk handle error
const isValidObjectId = require('../middlewares/isValidObjectId') //require middleware isValidObjectId (folder middleware)
const isAuth = require('../middlewares/isAuth'); //middleware untuk validasi authenticated user login
const { isAuthorReview } = require('../middlewares/isAuthor'); //middleware untuk authenticated review
const { validateReview } = require('../middlewares/validator') //middleware ke file validator.js (folder middleware)

const router = express.Router({mergeParams:true});



// Restfull untuk simpan review
router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync (ReviewControllers.store))

// restfull hapus review
router.delete('/:review_id', isAuth,isAuthorReview, isValidObjectId('/places'), 
wrapAsync(ReviewControllers.destroy))

module.exports = router;