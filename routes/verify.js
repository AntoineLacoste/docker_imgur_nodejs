let jwt     = require('jsonwebtoken');
let config  = require('../config');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey);
};

exports.verifyToken = function(req, res, next) {
    const token = req.body.token || req.query.token || req.params.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if(err) {
                res.json(err);
            }
            else {
                req.decoded = decoded;
                next();
            }
        })
    }
    else {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
};

exports.verifyCustomer = function(req, res, next) {
    if (req.decoded._doc.role !== 'customer') {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
    else {
        next();
    }
};

exports.verifyAdmin = function(req, res, next) {
    console.log(req.decoded._doc);
    if(req.decoded._doc.role === 'admin'){
        next();
    }
    else {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
};

exports.verifyImageGet = function (req, res, next) {
    Image.findOne({'_id': req.params.imageId}).then(function (image) {
        if(req.decoded._doc.images.contains === image._id)
            next();

        if(image.shared)
            next();

        res.status(401).json({status: 401, message: "Unauthorized"});
    }, function (err) {

    });
};