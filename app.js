// require untuk menggunakan express
const express = require('express');
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

// inisialiasi template engine EJS
app.set ('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// membuat route untuk halaman home 
app.get('/', (req, res) => {
    res.render('home');
});

// route untuk ke halaman seed 
app.get('/seed/place', async (req, res)=>{
        const place = new Place ({
            title:'Empire State',
            price:'$9999',
            description:'A Greet Movie',
            localtion:'New York, NY'
        })

        await place.save();   //menyimpan kedalam database
        res.send(place);      //tampilkan data yang ada didalam object place diatas 
    })

// inisialiasi untuk listen portnya
app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`)
});