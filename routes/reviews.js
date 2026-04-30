const express = require('express');
const Place = require('../models/place');   // import models mongoose dari file place.js
const Review = require('../models/review');// import model review
const ReviewControllers = require('../controllers/reviews'); //memanggil atau import file controllers > review.js
const { reviewSchema } = require('../schemas/review'); // schemas untuk reviews
const ErrorHandler = require('../utils/ErrorHandler');   //require untuk handling error dari class ExpressError
const wrapAsync = require('../utils/wrapAsync')  //requeire untuk handle error
const isValidObjectId = require('../middlewares/isValidObjectId') //require middleware isValidObjectId (folder middleware)
const isAuth = require('../middlewares/isAuth'); //middleware untuk validasi authenticated user login
const { isAuthorReview } = require('../middlewares/isAuthor'); //middleware untuk authenticated review

const router = express.Router({mergeParams:true});

// middleware untuk validasi review , agar mudah dimasukkan ke parameter, sama kaya wrapAsync
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next();
    }
}

// Restfull untuk simpan review
router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync (ReviewControllers.store))

// restfull hapus review
router.delete('/:review_id', isAuth,isAuthorReview, isValidObjectId('/places'), 
wrapAsync(ReviewControllers.destroy))

module.exports = router;