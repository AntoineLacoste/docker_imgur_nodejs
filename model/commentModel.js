var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    pseudo: String,
    text: String,
    post: {type: Schema.Types.ObjectId, ref: 'Post'}
});

module.exports = mongoose.model('Comment', commentSchema);