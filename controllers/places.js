const Place = require('../models/place');

module.exports.index = async (req, res) => {
     const places = await Place.find();  //mencari data place dari mongodb dengan method find
     res.render('places/index', {places}); //merender places ke lokasi places/index
}

module.exports.store = async (req, res, next )=> {   //async await karna perlu koneksi ke db
    const place = new Place (req.body.place);    // buat object didalam variabel place 
    place.author = req.user._id; //tambahan agar bisa muncul author nya saat di create baru
    await place.save(); 
    req.flash('success_msg','Place added succesfully');
    res.redirect('/places');
}

module.exports.show = async (req, res) => {
    const place = await Place.findById(req.params.id)
    .populate({
        path:'reviews',
        populate : {
            path:'author'
        }
    })
    .populate('author');
    // console.log(place);
    res.render('places/show', { place });
}

module.exports.edit = async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', {place} );
}

module.exports.update = async (req, res) => {
    // const {id} = req.params;
    // let place = await Place.findById(id);
    // if(!place.author.equals(req.user._id)) {
    //     req.flash('error_msg','Not authorized');
    //     return res.redirect ('/places');
    // }
    await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
    req.flash('success_msg','Place Updated Succesfully');
    res.redirect(`/places/${req.params.id}`);
}


module.exports.destroy = async (req, res ) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Place deleted Succesfully');
    res.redirect('/places');
}