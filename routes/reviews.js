const express = require('express');
const Place = require('../models/place');   // import models mongoose dari file place.js
const Review = require('../models/review');// import model review
const { reviewSchema } = require('../schemas/review'); // schemas untuk reviews
const ErrorHandler = require('../utils/ErrorHandler');   //require untuk handling error dari class ExpressError
const wrapAsync = require('../utils/wrapAsync')  //requeire untuk handle error

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
router.post('/', validateReview, wrapAsync (async (req, res) => {
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.place_id);
    place.reviews.push(review);
    await review.save();
    await place.save(); 
    res.redirect(`/places/${req.params.place_id}`);
}))

// restfull hapus review
router.delete('/:review_id', wrapAsync(async (req, res) => {
    const { place_id, review_id} = req.params;
    await Place.findByIdAndUpdate(place_id, {$pull: { reviews : review_id } } );
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/places/${place_id}`);
}) )

module.exports = router;