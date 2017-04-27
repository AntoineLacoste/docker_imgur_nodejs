const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const verify      = require('./verify');

router.put('/:advisorId/:customerId', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    User.findOne({'_id' : req.params.advisorId}).then(function (advisor) {
        if (advisor.advised.indexOf(req.params.customerId) < 0) {
            advisor.advised.push(req.params.customerId);
            advisor.save(function (err, advisor) {
                User.findOne({'_id' : req.params.advisorId}).populate('advised').then(function (advisor) {
                    res.status(200).json({
                        status: 200,
                        message: 'User successfully added to the advised list',
                        advisor: advisor
                    });
                })
            });
        }
        else {
            res.status(200).json({status: 200, message: 'User is already in the advised list'});
        }
    });
});

router.delete('/:customerId', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    User.findOneAndRemove({'_id' : req.params.customerId}).then(function (customer) {
            res.status(200).json({status: 200, message: 'User removed'});
    });
});

router.get('/all', verify.verifyToken, verify.verifyAdmin, function(req, res) {
    User.find({'role' : 'customer'}).then(function (customers) {
            res.json({customers: customers});
        }, function (err) {
            console.log(err);
        });
});

module.exports = router;