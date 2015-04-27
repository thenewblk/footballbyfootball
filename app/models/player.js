var mongoose = require( 'mongoose' );

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

var playerSchema = mongoose.Schema({
		name: String,
    slug: String,
    image_url: String,
    description: String,
    bio: String
});

playerSchema.pre('save', function (next) {
  var tmp_image = this.image_url;
  this.slug = slugify(this.name);
  var s3_url = "https://s3.amazonaws.com/footballbyfootball-dev";
  console.log('tmp_image.lastIndexOf(s3_url, 0) === 0): '+tmp_image.lastIndexOf(s3_url, 0) === 0);
  if (tmp_image.lastIndexOf(s3_url, 0) === 0) {

  } else {
  	this.image_url = s3_url + tmp_image;
  }
  
  next();
});

module.exports = mongoose.model('Player', playerSchema);