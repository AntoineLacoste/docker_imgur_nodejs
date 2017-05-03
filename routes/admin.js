const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const verify      = require('./verify');

router.get('/all', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    User.find({}).then(function (users) {
        res.status(200).message({status: 200, users: users});
    })
});

router.delete('/:imageId', verify.verifyToken, verify.verifyImageGet, function (req, res) {
   Image.findOneAndRemove({'_id': req.params.imageId}).then(function (image) {
       res.status(200).message({status: 200, message: 'image rmoved'});
   })
});

module.exports = router;