const ejsMate = require('ejs-mate') //import package ejs-mate

// require untuk menggunakan express
const express = require('express');
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


// import models mongoose dari file place.js
const Place =require('./models/place');

// engine untuk EJS-Mate
app.engine('ejs', ejsMate);

// inisialiasi template engine EJS
app.set ('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// middleware untuk proses save data ke express mongodb
app.use(express.urlencoded({extended:true}));
// middleware untuk mengubah method post 
app.use(methodOverride('_method'));


// membuat route untuk halaman home 
app.get('/', (req, res) => {
    res.render('home');
});

// membuat route untuk ke halaman index places
app.get('/places', async (req, res) => {
     const places = await Place.find();  //mencari data place dari mongodb dengan method find
     res.render('places/index', {places}); //merender places ke lokasi places/index
});

// route untuk ke halaman create difolder place
app.get('/places/create', (req, res) => {
    res.render('places/create');
})

// route untuk post Add New place dari create
app.post('/places', async (req, res) => {   //async await karna perlu koneksi ke db
    const place = new Place (req.body.place);    // buat object didalam variabel place 
    await place.save(); 
    res.redirect('/places');
})


// route untuk detail places
app.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/show', { place });
})

// route untuk edit places
app.get('/places/:id/edit', async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', {place} );
})

// Resfull update & simpan
app.put('/places/:id', async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
    res.redirect('/places');
})

// Restfull untuk delete
app.delete ('/places/:id', async (req, res ) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect('/places');
})


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

// inisialiasi untuk listen portnya
app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`)
});