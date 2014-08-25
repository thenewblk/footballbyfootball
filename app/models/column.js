var mongoose = require( 'mongoose' );
var moment = require('moment');

var columnSchema = mongoose.Schema({
    user : { type: String, ref: 'User' },
    title			 : String,
    excerpt    : String,
    content    : String,
    updated_date : String,
    updated_at : String,
    approved	 : Boolean,
    things: [ 
        { 
            post: { type: String, ref: 'Post' } ,
            instagram: { type: String, ref: 'Instagram' },
            position: Number 
        }
    ]
});

postSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();
  next();
});
 
module.exports = mongoose.model('Column', columnSchema);