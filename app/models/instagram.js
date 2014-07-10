var mongoose = require( 'mongoose' );

var instagramSchema = mongoose.Schema({
    url: String,
});

module.exports = mongoose.model('Instagram', instagramSchema);