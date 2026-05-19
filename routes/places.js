const express = require('express');
// const Place = require('../models/place');   // import models mongoose dari file place.js
const PlaceControllers = require('../controllers/places'); //panggil di folder controllers > places.js

const wrapAsync = require('../utils/wrapAsync');  //requeire untuk handle error
const isValidObjectId = require('../middlewares/isValidObjectId') //require middleware isValidObjectId (folder middleware)
const isAuth = require('../middlewares/isAuth'); //middleware untuk validasi authenticated user login
const { isAuthorPlace } = require('../middlewares/isAuthor'); //middleware isAuthorized 
const { validatePlace } = require('../middlewares/validator') //import middleware validator


const router = express.Router();

// middleware untuk validasi inputan , agar mudah dimasukkan ke parameter, sama kaya wrapAsync


// membuat route untuk ke halaman index places
router.get('/', wrapAsync(PlaceControllers.index));


// route untuk ke halaman create difolder place
router.get('/create', isAuth, (req, res) => {
    res.render('places/create');
})

// route untuk post Add New place dari create
router.post('/', isAuth, validatePlace, wrapAsync(PlaceControllers.store))


// route untuk detail places
router.get('/:id', isValidObjectId('/places'), wrapAsync(PlaceControllers.show))

// route untuk edit places
router.get('/:id/edit', isAuth, isAuthorPlace,  isValidObjectId('/places'), wrapAsync(PlaceControllers.edit))

// Resfull update & simpan
router.put('/:id', isAuth, isAuthorPlace, isValidObjectId('/places'), validatePlace, wrapAsync(PlaceControllers.update))


// Restfull untuk delete
router.delete ('/:id', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceControllers.destroy))



module.exports = router;