const Place = require('../models/place');
const fs = require('fs');  //import library filesystem dari node
const ExpressError = require('../utils/ErrorHandler');  //import middleware ExpressError

module.exports.index = async (req, res) => {
    const places = await Place.find();  //mencari data place dari mongodb dengan method find
    res.render('places/index', { places }); //merender places ke lokasi places/index
}

module.exports.store = async (req, res, next) => {   //async await karna perlu koneksi ke db
    const images = req.files.map(file => ({   //dapatkan file images dan lakukan mapping
        url: file.path,
        filename:file.filename
    })); 
    const place = new Place(req.body.place);    // buat object didalam variabel place 
    place.author = req.user._id; //tambahan agar bisa muncul author nya saat di create baru
    place.images = images; // tambahkan data untuk images dengan isian image diatas.
     
    await place.save();

    req.flash('success_msg', 'Place added succesfully');
    res.redirect('/places');
}

module.exports.show = async (req, res) => {     //agar bisa mem-populate author
    const place = await Place.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    // console.log(place);
    res.render('places/show', { place });
}

module.exports.edit = async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', { place });
}

module.exports.update = async (req, res) => {   //untuk edit dan update place yang sudah ada 
    // const {id} = req.params;
    // let place = await Place.findById(id);
    // if(!place.author.equals(req.user._id)) {
    //     req.flash('error_msg','Not authorized');
    //     return res.redirect ('/places');
    // }
    const place = await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    if (req.files && req.files.length > 0) {
        
        place.images.forEach( image => {        //hapus data image
            fs.unlink(image.url, err => new ExpressError(err)); //dari image url
        })
    
        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));
        place.images = images;          //update data images
        await place.save();
    }

    req.flash('success_msg', 'Place Updated Succesfully');
    res.redirect(`/places/${req.params.id}`);
}


module.exports.destroy = async (req, res) => {
    // await Place.findByIdAndDelete(req.params.id);     //yg lama
    const {id} = req.params;
    const place = await Place.findById(id);

     if (place.images.length > 0) {
        place.images.forEach( image => {        //hapus data image
            fs.unlink(image.url, err => new ExpressError(err)); //dari image url
        })
    
    }
    await place.deleteOne();

    req.flash('success_msg', 'Place deleted Succesfully');
    res.redirect('/places');
}