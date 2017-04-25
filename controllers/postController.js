var router     = require('express').Router();
var bodyParser = require('body-parser');
var data       = require('../helpers/data');
var filters    = require('../helpers/filters');
var fs         = require('fs');
var crypto     = require('crypto');
var multer     = require('multer');
var mime       = require('mime');
var db         = require('../config/db');
var postModel  = require('../model/postModel');
var commentModel  = require('../model/commentModel');

var parser     = bodyParser.urlencoded({extended: false});
var storage    = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(err, raw.toString('hex') + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file.mimetype.split('/')[0]);
        if(file.mimetype.split('/')[0] == 'image') {
            cb(null, true);
        }
        else {
            cb(new Error('Wrong file type'));
        }
    }
}).single('picture');

router.get('/:id', function(req, res) {
    var idPost = req.params.id;

    postModel.findById(idPost).populate('comments').then(function (post) {
            res.render('detail.html', { post: post });
        },
        function(err){
            console.log(err);
        });
});

router.get('/', function(req, res) {
    res.render('post.html', {});
});

router.post('/', function(req, res) {

    upload(req, res, function (err) {
        if(err){
            return res.render('post.html', {error: err});
        }

        var title    = req.body.title;
        var author   = req.body.author;
        var category = req.body.category;

        var post = new postModel({
            title: title,
            author: author,
            category: category,
            picture: req.file.path
        });

        post.save(function (err,post) {
            res.redirect('/');
        });

    });
});

router.post('/:id', parser, function(req, res) {
    var idPost = req.params.id;

    var comment = new commentModel({
        pseudo: req.body.pseudo,
        text: req.body.comment
    });

    comment.save(function (err, comment) {
        postModel.findById(idPost).populate('comments').then(function (post) {
            post.comments.push(comment);

            post.save(function (err,post) {
                res.redirect('/post/' + req.params.id);
            });
        },function (err) {
            console.log(err);
        });
    });
});

module.exports = router;
