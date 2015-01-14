var mongoose = require( 'mongoose' );

var thingSchema = mongoose.Schema({
	id: String,
    url: String,
    title: String,
    content: String,
    post: Boolean,
    instagram: Boolean
});

module.exports = mongoose.model('Thing', thingSchema);