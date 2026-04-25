const express = require('express');
const Place = require('../models/place');   // import models mongoose dari file place.js
const Review = require('../models/review');// import model review
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
router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync (async (req, res) => {
    const { place_id } = req.params;

    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();

    const place = await Place.findById(place_id);
    place.reviews.push(review);
    await place.save(); 
    
    req.flash('success_msg','Review added successfully')
    res.redirect(`/places/${place_id}`);
}))

// restfull hapus review
router.delete('/:review_id', isAuth,isAuthorReview, isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const { place_id, review_id} = req.params;
    await Place.findByIdAndUpdate(place_id, {$pull: { reviews : review_id } } );
    await Review.findByIdAndDelete(review_id);
    req.flash('success_msg','Review deleted successfully')
    res.redirect(`/places/${place_id}`);
}) )

module.exports = router;