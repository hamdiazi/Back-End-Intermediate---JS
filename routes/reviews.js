const express = require('express');
const ReviewControllers = require('../controllers/reviews'); //memanggil atau import file controllers > review.js

const wrapAsync = require('../utils/wrapAsync')  //requeire untuk handle error
const isValidObjectId = require('../middlewares/isValidObjectId') //require middleware isValidObjectId (folder middleware)
const isAuth = require('../middlewares/isAuth'); //middleware untuk validasi authenticated user login
const { isAuthorReview } = require('../middlewares/isAuthor'); //middleware untuk authenticated review
const {validateReview } = require('../middlewares/validator'); //import middleware dari validator.js (folder middlewares)

const router = express.Router({mergeParams:true});

// middleware untuk validasi review , agar mudah dimasukkan ke parameter, sama kaya wrapAsync


// Restfull untuk simpan review
router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync (ReviewControllers.store))

// restfull hapus review
router.delete('/:review_id', isAuth,isAuthorReview, isValidObjectId('/places'), 
wrapAsync(ReviewControllers.destroy))

module.exports = router;