const ejsMate = require('ejs-mate') //import package ejs-mate
const express = require('express');     // require untuk menggunakan express
const session = require('express-session'); //import library express-session
const flash = require('connect-flash'); //import library connect-flash
const ErrorHandler = require('./utils/ErrorHandler');   //require untuk handling error dari class ExpressError
const methodOverride = require('method-override'); // import method override
const path = require ('path');
const passport = require ('passport'); //import library passport (authentikasi) mongoose
const LocalStrategy = require('passport-local'); //import library authentikasi lokal
const User = require('./models/user'); //import model user
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

app.use(session({               //agar library session bisa digunakan
    secret:'secretekey',            //'secret' bisa diisi string bebas
    resave: false,  
    saveUninitialized:true, 
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(passport.session()); 
app.use(flash());   //supaya library connect-flash bisa digunakan
app.use(passport.initialize());     //supaya library password bisa digunakan
//passport.use(new LocalStrategy(User.authenticate));
passport.use(new LocalStrategy(User.authenticate())); //perbaikan dibantu ai
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {   //middleware flash-connect untuk session
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

// app.get('/set', (req, res) => {
//   req.session.test = "ok";
//   res.send("Session dibuat.");
// });

app.use('/', require('./routes/auth'));     //proses authentikasi panggil file auth.js
app.use('/places', require ('./routes/places'));    // panggil file routes/places.js
app.use('/places/:place_id/reviews', require('./routes/reviews'));  // panggil file routes/review.js  
app.use(express.static(path.join(__dirname, 'public'))); //middleware untuk static folder public

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

// membuat route untuk halaman home 
app.get('/', (req, res) => {
    res.render('home');
});

//route untuk register
// app.get('/register', async (req, res) => {
//     const user = new User({
//         email:'user@mail.com',
//         username:'user'
//     });
//     const newUser = await User.register(user, 'password')
//     res.send(newUser);
// })

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