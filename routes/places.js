const express = require('express');
// const Place = require('../models/place');   // import models mongoose dari file place.js
const PlaceControllers = require('../controllers/places'); //panggil di folder controllers > places.js

const wrapAsync = require('../utils/wrapAsync');  //requeire untuk handle error
const isValidObjectId = require('../middlewares/isValidObjectId') //require middleware isValidObjectId (folder middleware)
const isAuth = require('../middlewares/isAuth'); //middleware untuk validasi authenticated user login
const { isAuthorPlace } = require ('../middlewares/isAuthor'); //middleware isAuthorized 
const { validatePlace } = require('../middlewares/validator') //middleware ke validator places
const upload = require('../configs/multer')//import multer untuk upload image

const router = express.Router();


router.route('/')
.get(wrapAsync(PlaceControllers.index)) // membuat route untuk ke halaman index places
.post(isAuth, upload.array('image', 5), validatePlace, wrapAsync(PlaceControllers.store)) // route untuk post Add New place dari create
//  .post(isAuth, upload.array('image', 5), (req, res) => {
//     console.log(req.files)
//     console.log(req.body)
//     res.send('it works')
//  })


// route untuk ke halaman create difolder place
router.get('/create', isAuth, (req, res) => {
    res.render('places/create');
})

router.route('/:id')
    // route untuk detail places
    .get(isValidObjectId('/places'), wrapAsync(PlaceControllers.show))
    // Resfull update & simpan
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'), upload.array('image', 5),  validatePlace, wrapAsync(PlaceControllers.update))
    // Restfull untuk delete
   .delete (isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceControllers.destroy))



// route untuk edit places
router.get('/:id/edit', isAuth, isAuthorPlace,  isValidObjectId('/places'), wrapAsync(PlaceControllers.edit))

//route untuk delete images satu-persatu
router.delete('/:id/images', isAuth, isAuthorPlace,  isValidObjectId('/places'), wrapAsync(PlaceControllers.destroyImage) )

module.exports = router;