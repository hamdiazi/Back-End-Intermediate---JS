const ejsMate = require('ejs-mate') //import package ejs-mate

const express = require('express');     // require untuk menggunakan express
const ErrorHandler = require('./utils/ErrorHandler');   //require untuk handling error dari class ExpressError
// const Joi = require('joi'); //import library Joi
const methodOverride = require('method-override'); // import method override
const wrapAsync = require('./utils/wrapAsync')  //requeire untuk handle error
const path = require ('path');
const app = express();



// import mongoose untuk connect ke mongodb
const mongoose = require('mongoose');

// fungsi untuk connect ke mongodb
mongoose.connect('mongodb://127.0.0.1/bestpoints')
    .then((result) => {
        console.log('Connected to Mongodb')
    }).catch((err)=> {
        console.log(err)
    });


// import models mongoose dari file place.js
const Place = require('./models/place');

// import model review
const Review = require('./models/review')


//schemas 
const { placeSchema } = require('./schemas/place');

// schemas untuk reviews
const { reviewSchema } = require('./schemas/review')




//const ExpressError = require('./utils/ErrorHandler');

// engine untuk EJS-Mate
app.engine('ejs', ejsMate);

// inisialiasi template engine EJS
app.set ('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// middleware untuk proses save data ke express mongodb
app.use(express.urlencoded({extended:true}));
// middleware untuk mengubah method post 
app.use(methodOverride('_method'));

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




// membuat route untuk halaman home 
app.get('/', (req, res) => {
    res.render('home');
});

// membuat route untuk ke halaman index places
app.get('/places', wrapAsync(async (req, res) => {
     const places = await Place.find();  //mencari data place dari mongodb dengan method find
     res.render('places/index', {places}); //merender places ke lokasi places/index
}));

// route untuk ke halaman create difolder place
app.get('/places/create', (req, res) => {
    res.render('places/create');
})

// route untuk post Add New place dari create
app.post('/places', validatePlace, wrapAsync(async (req, res, next )=> {   //async await karna perlu koneksi ke db
    const place = new Place (req.body.place);    // buat object didalam variabel place 
    await place.save(); 
    res.redirect('/places');
}))


// route untuk detail places
app.get('/places/:id', wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    res.render('places/show', { place });
}))

// route untuk edit places
app.get('/places/:id/edit', wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', {place} );
}))

// Resfull update & simpan
app.put('/places/:id', validatePlace, wrapAsync(async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
    res.redirect('/places');
}))

// Restfull untuk delete
app.delete ('/places/:id', wrapAsync(async (req, res ) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect('/places');
}))

// Restfull untuk simpan review
app.post('/places/:id/reviews', validateReview, wrapAsync (async (req, res) => {
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.id);
    place.reviews.push(review);
    await review.save();
    await place.save(); 
    res.redirect(`/places/${req.params.id}`);
}))

// restfull hapus review
app.delete('/places/:place_id/reviews/:review_id', wrapAsync(async (req, res) => {
    const { place_id, review_id} = req.params;
    await Place.findByIdAndUpdate(place_id, {$pull: { reviews : review_id } } );
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/places/${place_id}`);
}) )

// route untuk ke halaman seed 
// app.get('/seed/place', async (req, res)=>{
//         const place = new Place ({
//             title:'Empire State',
//             price:'$9999',
//             description:'A Greet Movie',
//             localtion:'New York, NY'
//         })

//         await place.save();   //menyimpan kedalam database
//         res.send(place);      //tampilkan data yang ada didalam object place diatas 
//     })

app.all('*', (req, res, next) => {
    next(new ErrorHandler());
})


// middleware
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error', {err});
    // console.log(err.stack);
    // res.status(500).send('Something broke!')
})

// inisialiasi untuk listen portnya
app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`)
});