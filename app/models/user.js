// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var thingSchema = mongoose.Schema({
    id: String,
    url: String,
    title: String,
    content: String,
    post: Boolean,
    instagram: Boolean,
    position: Number
});

// define the schema for our user model
var userSchema = mongoose.Schema({
    name: String,
    position: String,
    description: String,
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    instagram        : {
        id           : String,
        token        : String,
        displayName     : String,
        name         : String
    },
    things: [ 
        { 
            post: { type: String, ref: 'Post' } ,
            instagram: { type: String, ref: 'Instagram' },
            column: { type: String, ref: 'Column' },
            position: Number 
        }
    ]

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
