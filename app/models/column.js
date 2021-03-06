var mongoose = require( 'mongoose' );
var moment = require('moment');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

var columnSchema = mongoose.Schema({
    user : { type: String, ref: 'User' },
    player : { type: String, ref: 'Player' },
    type       : String,
    title			 : { type : String , unique : true, },
    subtitle   : String,
    slug       : { type : String , unique : true, },
    excerpt    : String,
    updated_date : String,
    updated_at : String,
    approved	 : Boolean,
    data: [],
    main_image: {
      image_url:    String,
      caption:      String,
    }
});

columnSchema.pre('save', function (next) {
  this.updated_at = moment().format("MMMM Do, YYYY");
  this.updated_date = moment().format();



  if (!this.slug) {
    this.slug = slugify(this.title);
  }

  next();
});

module.exports = mongoose.model('Column', columnSchema);
