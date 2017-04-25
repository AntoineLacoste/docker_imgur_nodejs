var router    = require('express').Router();
var fs        = require('fs');
var data      = require('../helpers/data');
var filters   = require('../helpers/filters');
var postModel = require('../model/postModel');

router.get(['/', '/index'], function(req, res) {
    postModel.find({}).then(
        function(posts) {
            console.log(posts);
            res.render('index.html', { posts: posts });
        },
        function(err){
            console.log(err);
        });
});

router.get('/category/:name', function(req, res) {
    var name = req.params.name;

    postModel.find({'category': name}).then(function(posts) {
            res.render('index.html', { posts : posts });
        },
        function(err){
            console.log(err);
        });

});

module.exports = router;