const multer = require('multer');
const path = require('path');
const  ErrorHandler = require('../utils/ErrorHandler');


    //method untuk mengarahkan upload gambar ke lokasi public/images
    const storage = multer.diskStorage ({
    destination: function (req, file, cb) {
        cb(null, 'public/images/') //direktory penyimpanan gambar dalam folder public
    },

    //method untuk merubah nama file gambar agar tidak sama 
    filename: function (req, file, cb) {
        const uniqueSuffic = Date.now() + '_' + Math.round(Math.random () * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffic + path.extname(file.originalname));  //format nama file
        }
    });

    const upload = multer ({
        storage : storage,
        
        fileFilter : function(req, file, cb) {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }else {
                cb(new ExpressError('Only Images are allowed'));
            }
        }
    });

    module.exports = upload;

