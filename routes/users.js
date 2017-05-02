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

router.get('/:username', verify.verifyToken, function(req, res) {
    User.findOne({'username': req.params.username}).populate('images').then(function (user) {
        res.status(200).json({status: 200, user: user});
    }, function (err) {
        console.log(err);
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        req.logIn(user, function (err) {
            if(err){
                res.status(401).json({status: 401, message: "Username or password invalid"});
                return;
            }
            let token = verify.getToken(user);
            res.status(200).json({status: 200, message: "Authorized", username: user.username, role: user.role, token: token});
        })
    })(req, res, next);
});

router.post('/register', function(req, res) {
    User.register(new User({
        mail: req.body.mail,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        role: 'customer'
    }), req.body.password, function (err, user) {
        if (err) {
            res.status(500).json({status: 500, message: err.message});
            return;
        }
        res.status(200).json({status: 200, user: user});
    });
});

router.put('/:username', verify.verifyToken, function (req, res, next) {
    User.findOne({'username' : req.params.username}).then(function (user) {
        if(req.body.mail)      user.mail      = req.body.mail;
        if(req.body.firstname) user.firstname = req.body.firstname;
        if(req.body.lastname)  user.lastname  = req.body.lastname;
        if(req.body.username)  user.username  = req.body.username;

        user.save(function (err, user) {
            if(err) {
                res.json(err.message);
                return;
            }
            res.status(200).json({status: 200, message: "user successfully updated", user: user});
        });
    }, function (err) {
        console.log(err);
    });
});

router.post('/:userId', verify.verifyToken, function(req, res) {

    upload(req, res, function (err) {
        if(err){
            res.status(500).json({status: 500, message: "Wrong image", user: user});
        }

        const image = new Image({
            path: req.file.path,
            shared: false
        });

        image.save(function (err, image) {
            res.status(200).json({status: 200, message: "image successfully uploaded"});
        });

    });
});

router.post('/shared/:imageId', verify.verifyToken, function(req, res) {
    Image.findOne({'_id': req.params.imageId}).then(function (image) {
        image.shared = true;
        image.save(function (err, image) {
            res.status(200).json({status: 200, message: "image successfully shared"});
        })
    }, function (err) {
        console.log(err);
    });

    upload(req, res, function (err) {
        if(err){
            res.status(500).json({status: 500, message: "Wrong image", user: user});
        }

        const image = new Image({
            path: req.file.path,
            shared: false
        });

        image.save(function (err, image) {
            res.status(200).json({status: 200, message: "image successfully uploaded"});
        });

    });
});

module.exports = router;