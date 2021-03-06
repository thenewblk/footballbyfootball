var mongoose = require( 'mongoose' );
var moment = require('moment');
var columnSchema = require('./column');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

var lockerroomSchema = mongoose.Schema({
    user : { type: String, ref: 'User' },
    title			 : String,
    type       : String,
    slug       : String,
    excerpt    : String,
    updated_date : String,
    updated_at : String,
    approved	 : Boolean,
    lockerentries: [{
      player : { type: String, ref: 'Player' },
      excerpt    : String,
      updated_date : String,
      updated_at : String,
      approved   : Boolean,
      data: [ ],
    }],
    main_image: { 
      image_url:    String,
      caption:      String,
    }
});

lockerroomSchema.pre('save', function (next) {
  this.updated_at = moment().format("MMMM Do, YYYY");
  this.updated_date = moment().format();

  this.slug = slugify(this.title);
  
  next();
});
 
module.exports = mongoose.model('LockerRoom', lockerroomSchema);