const express  = require('express');
const router   = express.Router();
const User     = require('../model/user');
const passport = require('passport');
const verify   = require('./verify');
const multer   = require('multer');
const crypto   = require("crypto");
const Image    = require('../model/image');

const DIR = '../public/uploads/';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(err, raw.toString('hex') + '.' + mime.extension(file.mimetype));
        });
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file.mimetype.split('/')[0]);
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        }
        else {
            cb(new Error('Wrong file type'));
        }
    }
});

router.get('/:imageId', verify.verifyImageGet, function(req, res) {
    Image.findOne({'_id': req.params.imageId}).then(function (image) {
        image.shared = true;
        if(image.shared)
            res.sendFile(image.path);
        else
            res.status(401).json({status: 401, message: "Private image"});

    }, function (err) {
        console.log(err);
    });
});

router.post('/', verify.verifyToken, upload.any(), function(req, res) {

    console.log(req.file);
    // upload(req, res, function (err) {
    //     if(err){
    //         res.status(500).json({status: 500, message: "Wrong image"});
    //     }
    //
    //     const image = new Image({
    //         path: req.file.path,
    //         shared: false
    //     });
    //
    //     image.save(function (err, image) {
    //         User.findOne({'_id': req.decoded._id}).then(function (user) {
    //             user.images.push(image._id);
    //             user.save(function (err, user) {
    //                 res.status(200).json({status: 200, message: "image successfully uploaded"});
    //             })
    //         }, function (err) {
    //
    //         });
    //     });
    // });
});

module.exports = router;