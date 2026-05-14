module.exports = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error_msg','Anda Belum Melakukan Login');
        return res.redirect('/login');
    }
    next();
}