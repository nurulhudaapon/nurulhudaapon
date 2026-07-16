const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    let token = req.cookies.token;
        
    if (!token) return res.status(403).redirect('/admin-login.html');

    
    try {
        const decoded = jwt.verify(token, 'pk');
        req.admin = true;
        next();
    }
    catch(ex) {
        res.status(400).redirect('/admin-login.html');
    }
}