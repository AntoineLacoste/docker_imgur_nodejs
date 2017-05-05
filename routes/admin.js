const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const Image       = require('../model/image');
const verify      = require('./verify');

router.get('/all', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    console.log('mabite');
    User.find({'role': 'customer'}).populate('images').then(function (users) {
        console.log(users);
        res.status(200).json({status: 200, users: users});
    }, function (err) {
        console.log(err);
    });
});

router.delete('/image/:imageId', verify.verifyToken, verify.verifyImageDelete, function (req, res) {
    Image.findOneAndRemove({'_id': req.params.imageId}).then(function (image) {
        res.status(200).message({status: 200, message: 'Image successfully removed'});
    }, function (err) {
        console.log(err);
    })
});

router.delete('/user/:userId', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    User.findOneAndRemove({'_id': req.params.imageId}).then(function (image) {
        res.status(200).message({status: 200, message: 'User successfully removed'});
    }, function (err) {
        console.log(err);
    })
});

module.exports = router;