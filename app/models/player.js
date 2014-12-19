var mongoose = require( 'mongoose' );

var playerSchema = mongoose.Schema({
		name: String,
    image_url: String,
    description: String
});

playerSchema.pre('save', function (next) {
  var tmp_image = this.image_url;
  var s3_url = "https://s3.amazonaws.com/footballbyfootball-dev";
  console.log('tmp_image.lastIndexOf(s3_url, 0) === 0): '+tmp_image.lastIndexOf(s3_url, 0) === 0);
  if (tmp_image.lastIndexOf(s3_url, 0) === 0) {

  } else {
  	this.image_url = s3_url + tmp_image;
  }
  
  next();
});

module.exports = mongoose.model('Player', playerSchema);