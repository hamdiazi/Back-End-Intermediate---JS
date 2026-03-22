const ejsMate = require('ejs-mate') //import package ejs-mate
const express = require('express');     // require untuk menggunakan express
const ErrorHandler = require('./utils/ErrorHandler');   //require untuk handling error dari class ExpressError
const methodOverride = require('method-override'); // import method override
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

//const ExpressError = require('./utils/ErrorHandler');

// engine untuk EJS-Mate
app.engine('ejs', ejsMate);

// inisialiasi template engine EJS
app.set ('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// middleware untuk proses save data ke express mongodb
app.use(express.urlencoded({ extended:true }));
// middleware untuk mengubah method post 
app.use(methodOverride('_method'));

// membuat route untuk halaman home 
app.get('/', (req, res) => {
    res.render('home');
});


app.use('/places', require ('./routes/places'));    // panggil file routes/places.js
app.use('/places/:place_id/reviews', require('./routes/reviews'));  // panggil file routes/review.js  






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



// bagian error Handler semua halaman
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