let mongoose              = require('mongoose');
let Schema                = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');
let Account               = require('./account');

let User = new Schema({
    mail: {
        type: String,
        unique: true
    },
    firstname: String,
    lastname: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'customer']
    },
    images: [{type: Schema.Types.ObjectId, ref: 'Image', default: []}]
});

User.plugin(passportLocalMongoose);

let userModel     = mongoose.model('User', User);

userModel.find({}).then(
    function(customers) {

        if (customers.length === 0) {

            userModel.register(new userModel({
                mail: 'toto@toto.toto',
                firstname: 'Sebouninet',
                lastname: 'Foray',
                username: 'miniForay',
                advised: [],
                role: 'customer'
            }), 'azerty', function () {});

            userModel.register(new userModel({
                mail: 'tutu@tutu.tutu',
                firstname: 'Roger',
                lastname: 'Colvray',
                username: 'admin',
                role: 'admin'
            }), 'admin', function(){});
        }
    });

module.exports = userModel;