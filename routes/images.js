const express  = require('express');
const router   = express.Router();
const User     = require('../model/user');
const passport = require('passport');
const verify   = require('./verify');
const multer   = require('multer');
const Image    = require('../model/image');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
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
}).single('picture');

router.get('/:imageId', verify.verifyToken, function(req, res) {
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

module.exports = router;