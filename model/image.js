const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const Image = new Schema({
    path: String,
    shared: Boolean
});

module.exports = mongoose.model('Image', Image);