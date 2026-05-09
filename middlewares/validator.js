const { placeSchema } = require('../schemas/place');  //schemas  untuk places
const { reviewSchema } = require('../schemas/review'); // schemas untuk reviews
const ErrorHandler = require('../utils/ErrorHandler');   //require untuk handling error dari class ExpressError


// middleware untuk validasi inputan , agar mudah dimasukkan ke parameter, sama kaya wrapAsync
module.exports.validatePlace = (req, res, next) => {
    const {error} = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next();
    }
}

// middleware untuk validasi review , agar mudah dimasukkan ke parameter, sama kaya wrapAsync
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next();
    }
}