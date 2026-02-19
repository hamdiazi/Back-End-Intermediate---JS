// require untuk menggunakan express
const express = require('express');
const path = require ('path');
const app = express();

// inisialiasi template engine EJS
app.set ('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// membuat route untuk halaman home 
app.get('/', (req, res) => {
    res.render('home');
});

// inisialiasi untuk listen portnya
app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`)
});