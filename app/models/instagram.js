var mongoose = require( 'mongoose' );

var instagramSchema = mongoose.Schema({
	user : { type: String, ref: 'User' },
	id: String,
  url: String
});

module.exports = mongoose.model('Instagram', instagramSchema);