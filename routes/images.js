const express  = require('express');
const router   = express.Router();
const User     = require('../model/user');
const passport = require('passport');
const verify   = require('./verify');
const multer   = require('multer');
const crypto   = require("crypto");
const mime     = require('mime');
const Image    = require('../model/image');

const DIR = 'public/uploads/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "." + mime.extension(file.mimetype));
    }
});

const upload = multer({storage: storage});

router.get('/:imageId', verify.verifyToken, verify.verifyImageGet, function(req, res) {
    Image.findOne({'_id': req.params.imageId}).then(function (image) {
        res.sendFile(image.path);
    }, function (err) {
        console.log(err);
    });
});

router.post('/', verify.verifyToken, upload.any(), function(req, res) {
    const image = new Image({
        path: req.files[0].path,
        shared: false
    });

    image.save(function (err, image) {
        User.findOne({'_id': req.decoded._doc._id}).then(function (user) {
            user.images.push(image._id);
            user.save(function (err, user) {
                res.status(200).json({status: 200, message: "image successfully uploaded"});
            })
        }, function (err) {

        });
    });
});

module.exports = router;