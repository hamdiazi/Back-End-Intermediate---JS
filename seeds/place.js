const mongoose = require('mongoose');
const Place = require('../models/place');

mongoose.connect('mongodb://127.0.0.1/bestpoints')
    .then((result) => {
        console.log('connected to mongodb')
    }).catch((err) => {
        console.log(err)
    });

async function seedPlaces() {
    const places = [
        {
            title: 'Taman Mini Indonesia Indah',
            price: 5000,
            description: 'Taman hiburan keluarga dengan berbagai replika bangunan dari seluruh Indonesia',
            location: 'Taman Mini Indonesia Indah, Jakarta',
            image:'https://video.cgtn.com/news/77416a4e7a67544e786b544f344d444e304d7a4e31457a6333566d54/video/ca413729bcf64502ab923c080b9d0920/ca413729bcf64502ab923c080b9d0920.jpg',
        },
        {
            title: 'Pantai Kuta',
            price: 2500,
            description: 'Pantai yang terkenal di Bali dengan pemandangan sunset yang indah',
            location: 'Pantai Kuta, Kuta, Badung Regency, Bali',
            image:'http://source.unsplash.com/collection/2349781/1280x720',
        }
    ]

    try {
        const newPlace = places.map( place => {
            return {...place, author:'69f107ae863e2787c4164277'}
        })
        await Place.deleteMany({});
        await Place.insertMany(newPlace);
        console.log('Data berhasil disimpan');
    } catch (err) {
        console.log('Terjadi kesalahan saat menyimpan data:', err);
    } finally {
        mongoose.disconnect();
    }
}

seedPlaces();