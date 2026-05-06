const express = require('express');
// const Place = require('../models/place');   // import models mongoose dari file place.js
const PlaceControllers = require('../controllers/places'); //panggil di folder controllers > places.js
const { placeSchema } = require('../schemas/place');  //schemas  untuk places
const ErrorHandler = require('../utils/ErrorHandler');   //require untuk handling error dari class ExpressError
const wrapAsync = require('../utils/wrapAsync');  //requeire untuk handle error
const isValidObjectId = require('../middlewares/isValidObjectId') //require middleware isValidObjectId (folder middleware)
const isAuth = require('../middlewares/isAuth'); //middleware untuk validasi authenticated user login
const { isAuthorPlace } = require ('../middlewares/isAuthor'); //middleware isAuthorized 


const router = express.Router();

// middleware untuk validasi inputan , agar mudah dimasukkan ke parameter, sama kaya wrapAsync
const validatePlace = (req, res, next) => {
    const {error} = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next();
    }
}


router.route('/')
.get(wrapAsync(PlaceControllers.index)) // membuat route untuk ke halaman index places
.post(isAuth, validatePlace, wrapAsync(PlaceControllers.store)) // route untuk post Add New place dari create
 


// route untuk ke halaman create difolder place
router.get('/create', isAuth, (req, res) => {
    res.render('places/create');
})

// ---------------------------------------------------------

router.route('/:id')
    // route untuk detail places
    .get(isValidObjectId('/places'), wrapAsync(PlaceControllers.show))
    // Resfull update & simpan
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'), validatePlace, wrapAsync(PlaceControllers.update))
    // Restfull untuk delete
   .delete (isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceControllers.destroy))



// route untuk edit places
router.get('/:id/edit', isAuth, isAuthorPlace,  isValidObjectId('/places'), wrapAsync(PlaceControllers.edit))








module.exports = router;