var mongoose = require( 'mongoose' );

var playerSchema = mongoose.Schema({
		name: String,
    image_url: String,
    description: String
});

module.exports = mongoose.model('Player', playerSchema);