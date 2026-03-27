const express = require('express');
const Place = require('../models/place');   // import models mongoose dari file place.js
const { placeSchema } = require('../schemas/place');  //schemas  untuk places
const ErrorHandler = require('../utils/ErrorHandler');   //require untuk handling error dari class ExpressError
const wrapAsync = require('../utils/wrapAsync')  //requeire untuk handle error

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

// membuat route untuk ke halaman index places
router.get('/', wrapAsync(async (req, res) => {
     const places = await Place.find();  //mencari data place dari mongodb dengan method find
     res.render('places/index', {places}); //merender places ke lokasi places/index
}));


// route untuk ke halaman create difolder place
router.get('/create', (req, res) => {
    res.render('places/create');
})

// route untuk post Add New place dari create
router.post('/', validatePlace, wrapAsync(async (req, res, next )=> {   //async await karna perlu koneksi ke db
    const place = new Place (req.body.place);    // buat object didalam variabel place 
    await place.save(); 
    req.flash('success_msg','Place added Succesfully');
    res.redirect('/places');
}))



// route untuk detail places
router.get('/:id', wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    res.render('places/show', { place });
}))

// route untuk edit places
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', {place} );
}))

// Resfull update & simpan
router.put('/:id', validatePlace, wrapAsync(async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
    res.redirect('/places');
}))

// Restfull untuk delete
router.delete ('/:id', wrapAsync(async (req, res ) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect('/places');
}))



module.exports = router;