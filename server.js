// server.js
require('newrelic');
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var sass = require('node-sass');

var knox = require('knox');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var pub = __dirname + '/assets';


if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);

} else {
    var redis = require("redis").createClient();
}

RedisStore = require('connect-redis')(express);


app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
	app.use(express.static(pub));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs'); // set up ejs for templating
  app.use(express.session({ secret: "bangarang",
    maxAge : new Date(Date.now() + 7200000),
    store: new RedisStore({client: redis})
  }));
	// required for passport
	app.use(express.session({ secret: 'bangarang' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

	app.use(
	   sass.middleware({
	       src: __dirname + '/sass', //where the sass files are 
	       dest: __dirname + '/assets', //where css should go
	       outputStyle: 'compressed',
	       debug: true // obvious
	   })
	);

});

// routes ======================================================================
require('./app/routes.js')(app, passport, knox); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
