var mongoose = require( 'mongoose' );
var moment = require('moment');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

var linkSchema = mongoose.Schema({
    title			 : String,
    link       : String,
    slug       : String,
    updated_date : String,
    updated_at : String,
    approved	 : Boolean
});

linkSchema.pre('save', function (next) {
  this.updated_at = moment().format("MMMM Do, YYYY");
  this.updated_date = moment().format();

  this.slug = slugify(this.title);
  
  next();
});
 
module.exports = mongoose.model('Link', linkSchema);