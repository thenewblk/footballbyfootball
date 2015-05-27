var InstagramGlobal = require('instagram-node-lib');

var User = require('./models/user'),
		Post = require('./models/post'),
		Instagram = require('./models/instagram'),
		Column = require('./models/column'),
		Player = require('./models/player'),
		LockerRoom = require('./models/lockerroom'),
		Link = require('./models/link'),
		Podcast = require('./models/podcast'),
		moment = require('moment');

// Require module
var Feed = require('rss');

var  	async = require('async'),
		mime = require('mime'),
    	fs = require('fs'),
    	util = require('util'),
    	auth = require('../config/auth.js');
    	
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = function(app, passport, knox) {
// normal routes ===============================================================
	// Home Page
	app.get('/', function(req, res) {
		Column.find({approved: true}).sort({updated_date: 1}).populate('player').exec(function(err, columns) {
			LockerRoom.find({approved: true}).sort({updated_date: 1}).populate('lockerentries.player').exec(function(err, lockerrooms) {
				Link.find().where({approved: true}).sort({updated_date: -1}).limit(5).exec(function(err, links) {


					var entries = columns.concat(lockerrooms);

					var things = entries.sort(function(a,b){
						if (moment(a.updated_date).valueOf() > moment(b.updated_date).valueOf()) return -1;
						if (moment(a.updated_date).valueOf() < moment(b.updated_date).valueOf()) return 1;
						return 0;
					});

					res.render('index.ejs', {
						user : req.user,
						columns : columns,
						lockerrooms : lockerrooms,
						entries : things,
						links : links,
						page_type: 'home',
						today: moment().format("MMMM Do, YYYY")
					});
				});
			});
    	});
	});

		// PROFILE SECTION =========================
	app.get('/admin', isLoggedIn, function(req, res) {
		Player.find().sort({name: 1}).exec(function(err, players) {
			Column.find().sort({updated_date: -1}).limit(5).exec(function(err, columns) {
				LockerRoom.find().sort({updated_date: -1}).limit(5).exec(function(err, lockerrooms) {
					Link.find().sort({updated_date: -1}).limit(5).exec(function(err, links) {
						Podcast.find().sort({updated_date: -1}).limit(5).exec(function(err, podcasts) {
						res.render('admin/index.ejs', {
							user : req.user,
							players : players,
							columns : columns,
							podcasts : podcasts,
							links : links,
							lockerrooms : lockerrooms,
							page_type: 'admin'
						});
					});
				});
			});
			});
    	});
	});


	app.get('/writers', function(req, res) {
		Player.find({published: true}).sort({name: 1}).exec(function(err, writers) {

			res.render('writers.ejs', {
				user : req.user,
				writers : writers,
				page_type: 'home',
				today: moment().format("MMMM Do, YYYY")
			});

    	});
	});

	app.get('/about', function(req, res) {
		res.render('about.ejs', {
			user : req.user,
			page_type: 'home',
			today: moment().format("MMMM Do, YYYY")
		});
	});

	app.get('/privacyandterms', function(req, res) {
		res.render('privacy.ejs', {
			user : req.user,
			page_type: 'home',
			today: moment().format("MMMM Do, YYYY")
		});
	});

	app.get('/admin/columns', isLoggedIn, function(req, res) {
	  	Column.find().sort({updated_date: -1}).exec(function(err, columns) {
				res.render('admin/columns.ejs', {
					user : req.user,
					columns : columns,
					page_type: 'admin'
				});
		});
	});
	
	app.get('/admin/lockerrooms', isLoggedIn, function(req, res) {
	  	LockerRoom.find().sort({updated_date: -1}).exec(function(err, lockerrooms) {
			res.render('admin/lockerrooms.ejs', {
				user : req.user,
				lockerrooms : lockerrooms,
				page_type: 'admin'
			});
		});
	});

	app.get('/admin/players', isLoggedIn, function(req, res) {
  		Player.find().sort({updated_date: -1}).exec(function(err, players) {
			res.render('admin/players.ejs', {
				user : req.user,
				players : players,
				page_type: 'admin'
			});
		});
	});

	app.get('/admin/links', isLoggedIn, function(req, res) {
  		Link.find().sort({updated_date: -1}).exec(function(err, links) {
			res.render('admin/links.ejs', {
				user : req.user,
				links : links,
				page_type: 'admin'
			});
		});
	});

	app.get('/columns', function(req, res) {
		Column.find({approved: true, type: 'column'}).sort({updated_date: -1}).populate('player').exec(function(err, columns) {
			res.render('columns.ejs', {
				user : req.user,
				columns : columns,
				page_type: 'column',
				page_title: 'Columns',
				today: moment().format("MMMM Do, YYYY")
			});
		});
	});
	app.get('/locks', function(req, res) {
		Column.find({approved: true, type: 'locks'}).sort({updated_date: -1}).populate('player').exec(function(err, columns) {
			res.render('columns.ejs', {
				user : req.user,
				columns : columns,
				page_type: 'column',
				page_title: 'Locks',
				today: moment().format("MMMM Do, YYYY")
			});
		});
	});
	
	app.get('/fantasy', function(req, res) {
		Column.find({approved: true, type: 'fantasy'}).sort({updated_date: -1}).populate('player').exec(function(err, columns) {
			res.render('columns.ejs', {
				user : req.user,
				columns : columns,
				page_type: 'column',
				page_title: 'Fantasy',
				today: moment().format("MMMM Do, YYYY")
			});
		});
	});

	app.get('/lockerrooms', function(req, res) {
		LockerRoom.find({approved: true}).sort({updated_date: -1}).populate('lockerentries.player').exec(function(err, lockerrooms) {
			res.render('lockerrooms.ejs', {
				user : req.user,
				lockerrooms : lockerrooms,
				page_type: 'column',
				today: moment().format("MMMM Do, YYYY")
			});
		});
	});

	app.get('/archive', function(req, res) {
		Column.find({approved: true}).sort({updated_date: 1}).populate('player').exec(function(err, columns) {
			LockerRoom.find({approved: true}).sort({updated_date: 1}).populate('lockerentries.player').exec(function(err, lockerrooms) {

				var entries = columns.concat(lockerrooms);

				var things = entries.sort(function(a,b){
					if (moment(a.updated_date).valueOf() > moment(b.updated_date).valueOf()) return -1;
					if (moment(a.updated_date).valueOf() < moment(b.updated_date).valueOf()) return 1;
					return 0;
				});

				res.render('archive.ejs', {
					user : req.user,
					entries : things,
					page_type: 'column',
					today: moment().format("MMMM Do, YYYY")
				});
			});
    });
	});

	app.get('/links', function(req, res) {
		Link.find({approved: true}).sort({updated_date: -1}).exec(function(err, links) {
			res.render('links.ejs', {
				user : req.user,
				links : links,
				page_type: 'column',
				today: moment().format("MMMM Do, YYYY")
			});
		});
	});

	// Article Example
	app.get('/article-example', function(req, res) {
	  User.find().exec(function(err, users) {
			res.render('article.ejs', {
				user : req.user,
				page_type: 'column'
			});
    });
	});

	// Column Page
	app.get('/column/base', function(req, res) {
		User.findById(req.user)
        .populate('things.post things.instagram')
        .exec(function(err, user) {
					res.render('column-editor/base.ejs', {
						user: req.user,
						player : user,
						page_type: 'column'
					});
        });
	});

	// User Page
	app.get('/users/:user_id', function(req, res) {
		User.findById(req.params.user_id)
        .populate('things.post things.instagram')
        .exec(function(err, user) {
					res.render('public-profile.ejs', {
						user: req.user,
						player : user,
						path: req.path
					});
        });
	});

	// Edit User Profile Page
	app.get('/profile/edit', isLoggedIn, function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			res.render('edit-profile.ejs', {
				user: req.user,
				player: req.user,
				path: req.path
			});
		});
	});

	// Saving User Profile Settings
	app.post('/users/:user_id', function(req, res) {
		User.findById( req.params.user_id, function(err, user) {
			user.name = req.body.name;
			user.position = req.body.position;
			user.description = req.body.description;
			user.save();
			res.redirect('/profile');
		});
	});


	// Repositioning with AJAX via jQuery UI Sortable
	app.post('/thing-position', isLoggedIn, function(req, res) {
		
		User.findById(req.user.id, function(err, user) {
			var new_order = req.body.thing;

			for ( var thing = 0; thing < user.things.length; thing++ ){
				for ( new_id in new_order ) {
					if ( user.things[thing]._id == new_order[new_id] ) {
						user.things[thing].position = new_id;
					}
				}
			}
			user.save();
		});
	});


	// Add Instagram Images to User Grid
	app.post('/users/:user_id/instagram', function(req, res) {
		var standardRes = req.body.standardRes;
		var instagramId = req.body.instagramId;

		User.findById( req.params.user_id, function(err, this_user) {
			if ( this_user.things.id(instagramId) ) {
				res.send(false);
			} else {
				var tmp_instagram = new Instagram( { url: standardRes, id: instagramId, user: this_user._id } );
				tmp_instagram.save( function (err, this_instagram) {
				  if (err) return console.log(err);

				  this_user.things.push( { instagram: this_instagram._id, position: -1 } );
					this_user.save(function(err) {
		          res.send(true);
		      });
				})
			}	
		});
	});

	// Remove Instagram Images from User Grid
	app.post('/users/:user_id/instagram/:instagram_id', function(req, res) {
		var instagramId = req.params.instagram_id;
		User.findById(req.params.user_id)
        .populate('things.instagram')
        .exec(function(err, user) {
					if(err) return next(err);

			    for(var i = 0; i < user.things.length; i++ ) {
			    	if (user.things[i].instagram ) {
			        if (user.things[i].instagram.id == instagramId) { 
			        	console.log('removed: '+user.things[i].id);
			          user.things.remove(user.things[i]._id.toString());
			        }
			      }
		      }
					
					user.save();
					res.send(true);
				});
	});

	// Column Page
	app.get('/column/new', isLoggedIn, function(req, res) {
		Player.find().sort({name: 1}).exec(function(err, players) {
			res.render('column-editor/new.ejs', {
				user: req.user,
				players : players,
				page_type: 'column'
			});
    });
	});

	// Add New Column
	app.post('/column/new', isLoggedIn, function(req, res) {
		var title = req.body.title;
		var subtitle = req.body.subtitle;
		var data = req.body.data;
		var main_image = req.body.main_image;
		var player = req.body.player;
		var approved = req.body.approved;
		var type = req.body.type;

		Column.create({ title: title, subtitle: subtitle, data: data, main_image: main_image, player: player, approved: approved, type: type}, function (err, column) {
		  if (err) return console.log(err);
		  	res.send(column.slug);
		});
	});


	// Display Column
	app.get('/column/:slug', function(req, res) {
		Column
			.findOne({ slug: req.params.slug })
			.populate('player')
			.exec( function (err, column) {
			  if (err) return console.log(err);
				res.render('column.ejs', {
					user : req.user,
					column : column,
					page_type: 'column'
				});
		});
	});

		// Display Column
	app.get('/api/column/:slug', function(req, res) {
		Column
			.findOne({ slug: req.params.slug })
			.populate('player')
			.exec( function (err, column) {
			  	if (err) return console.log(err);
				res.send(column);
		});
	});

	// Delete Column
	app.delete('/column/:slug/delete', function(req, res) {
		Column
			.findOne({ slug: req.params.slug })
			.remove( function (err, column) {
			  if (err) return console.log(err);
				res.send(true);
		});
	});


	// Display Edit Column Form
	app.get('/column/:slug/edit', isLoggedIn, function(req, res) {
		Player.find().sort({name: 1}).exec(function(err, players) {
			Column
				.findOne({ slug: req.params.slug })
				.populate('player')
				.exec( function (err, column) {
				  if (err) {
				  	console.log(err);
				  	res.render('column-editor/edit.ejs', {
							user : req.user,
							players : players,
							column : column,
							page_type: 'column'
						});
				  }
					res.render('column-editor/edit.ejs', {
						user : req.user,
						players : players,
						column : column,
						page_type: 'column'
					});
			});
		});
	});

	// Edit Column
	app.post('/column/:slug/edit', isLoggedIn, function(req, res) {
		tmp_column = {};
		tmp_column.title = req.body.title;
		tmp_column.subtitle = req.body.subtitle;
		tmp_column.data = req.body.data;
		tmp_column.main_image = req.body.main_image;
		tmp_column.player = req.body.player;
		tmp_column.approved = req.body.approved;
		tmp_column.type = req.body.type;


		Column
			.findOne({ slug: req.params.slug })
			.exec(function (err, column) {
			  if (err) return console.log(err);

				column.title = tmp_column.title;
				column.subtitle = tmp_column.subtitle;
				column.data = tmp_column.data;
				column.main_image = tmp_column.main_image;
				column.player = tmp_column.player;
				column.approved = tmp_column.approved;
				column.type = tmp_column.type;


			  column.save(function (err) {
	  			if (err) return console.log(err);
			  	res.send(column.slug);
			  });
			});
	});


	// Locker Room Page
	app.get('/lockerroom/new', isLoggedIn, function(req, res) {
		Player.find().sort({name: 1}).exec(function(err, players) {
			res.render('lockerroom-editor/new.ejs', {
				user: req.user,
				players : players,
				page_type: 'lockerroom'
			});
    });
	});

	// Add New Locker Room
	app.post('/lockerroom/new', isLoggedIn, function(req, res) {
		var title = req.body.title;
		var lockerentries = req.body.lockerentries;
		var approved = req.body.approved;
		var type = req.body.type;
		var main_image = req.body.main_image;

		LockerRoom.create({ title: title, lockerentries: lockerentries, approved: approved, type: type, main_image: main_image}, function (err, lockerroom) {
		  if (err) return console.log(err);
		  	res.send(lockerroom.slug);
		});
	});


	// Display Locker Room
	app.get('/lockerroom/:slug', function(req, res) {
		LockerRoom.find({approved: true}).sort({updated_date: -1}).limit(5).exec(function(err, recent_lockers) {
			LockerRoom
				.findOne({ slug: req.params.slug })
				.populate('lockerentries.player')
				.exec( function (err, lockerroom) {
				  if (err) return console.log(err);
					res.render('lockerroom.ejs', {
						user : req.user,
						lockerroom : lockerroom,
						recent_lockers : recent_lockers,
						page_type: 'lockerroom'
					});
			});
		});
	});

	// Delete Locker Room
	app.delete('/lockerroom/:slug/delete', function(req, res) {
		LockerRoom
			.findOne({ slug: req.params.slug })
			.remove( function (err, lockerroom) {
			  if (err) return console.log(err);
				res.send(true);
		});
	});


	// Display Edit Locker Room Form
	app.get('/lockerroom/:slug/edit', isLoggedIn, function(req, res) {
		Player.find().sort({name: 1}).exec(function(err, players) {
			LockerRoom
				.findOne({ slug: req.params.slug })
				.populate('lockerentries.player')
				.exec( function (err, lockerroom) {
				  if (err) {
				  	console.log(err);
				  	res.render('lockerroom-editor/edit.ejs', {
							user : req.user,
							players : players,
							lockerroom : lockerroom,
							page_type: 'lockerroom'
						});
				  }
					res.render('lockerroom-editor/edit.ejs', {
						user : req.user,
						players : players,
						lockerroom : lockerroom,
						page_type: 'lockerroom'
					});
			});
		});
	});

	// Edit Locker Room
	app.post('/lockerroom/:slug/edit', isLoggedIn, function(req, res) {
		console.log('/lockerroom/:slug/edit: '+util.inspect(req.body));
		tmp_lockerroom = {};
		tmp_lockerroom.title = req.body.title;
		tmp_lockerroom.lockerentries = req.body.lockerentries;
		tmp_lockerroom.approved = req.body.approved;
		tmp_lockerroom.type = req.body.type;
		tmp_lockerroom.main_image = req.body.main_image;

		LockerRoom
			.findOne({ slug: req.params.slug })
			.exec(function (err, lockerroom) {
			  if (err) return console.log(err);
			  lockerroom.title = tmp_lockerroom.title;
				lockerroom.lockerentries = tmp_lockerroom.lockerentries;
				lockerroom.approved = tmp_lockerroom.approved;
				lockerroom.type = tmp_lockerroom.type;
				lockerroom.main_image = tmp_lockerroom.main_image;

			  lockerroom.save(function (err) {
	  			if (err) return console.log(err);
			  	res.send(lockerroom.slug);
			  });
			});
	});

		// Display New Link Form
	app.get('/link/new', isLoggedIn, function(req, res) {
		res.render('link/new.ejs', {
			user: req.user,
			page_type: 'column'
		});
	});

	// Add New link
	app.post('/link/new', isLoggedIn, function(req, res) {
		var title = req.body.title;
		var link = req.body.link;
		var approved = req.body.approved;

		Link.create({ title: title, link: link, approved: approved }, function (err, link) {
		  if (err) return console.log(err);
		  	res.redirect('/admin');
		});
	});

	// Display Link
	app.get('/link/:slug', function(req, res) {
		Link
			.findOne({ slug: req.params.slug })
			.exec( function (err, link) {
			  if (err) return console.log(err);
				res.render('link/show.ejs', {
					user : req.user,
					link : link,
					page_type: 'column'
				});
		});
	});

		// Delete Locker Room
	app.delete('/link/:slug/delete', function(req, res) {
		Link
			.findOne({ slug: req.params.slug })
			.remove( function (err, link) {
			  if (err) return console.log(err);
				res.send(true);
		});
	});


	// Display Edit Link Form
	app.get('/link/:slug/edit', isLoggedIn, function(req, res) {
		Link
			.findOne({ slug: req.params.slug })
			.exec( function (err, link) {
			  if (err) {
			  	console.log(err);
				}
				res.render('link/edit.ejs', {
					user : req.user,
					link : link,
					page_type: 'column'
				});
		});
	});

	// Edit Link
	app.post('/link/:slug/edit', isLoggedIn, function(req, res) {
		console.log('/link/:slug/edit: '+util.inspect(req.body));
		tmp_link = {};
		tmp_link.title = req.body.title;
		tmp_link.link = req.body.link;
		tmp_link.approved = req.body.approved;

		Link
			.findOne({ slug: req.params.slug })
			.exec(function (err, link) {
			  if (err) return console.log(err);
			  link.title = tmp_link.title;
				link.link = tmp_link.link;
				link.approved = tmp_link.approved;

			  link.save(function (err) {
	  			if (err) return console.log(err);
			  	res.redirect('/admin');
			  });
			});
	});


		// Display New Link Form
	app.get('/podcast/new', isLoggedIn, function(req, res) {
		res.render('podcast/new.ejs', {
			user: req.user,
			page_type: 'column'
		});
	});

	// Add New podcast
	app.post('/podcast/new', isLoggedIn, function(req, res) {
		var title = req.body.title;
		var podcast = req.body.podcast;
		var approved = req.body.approved;

		Podcast.create({ title: title, podcast: podcast, approved: approved }, function (err, podcast) {
		  if (err) return console.log(err);
		  	res.redirect('/admin');
		});
	});

	// Display podcast
	app.get('/podcast/:slug', function(req, res) {
		Podcast
			.findOne({ slug: req.params.slug })
			.exec( function (err, podcast) {
			  if (err) return console.log(err);
				res.render('podcast/show.ejs', {
					user : req.user,
					podcast : podcast,
					page_type: 'column'
				});
		});
	});

		// Delete Locker Room
	app.delete('/podcast/:slug/delete', function(req, res) {
		Podcast
			.findOne({ slug: req.params.slug })
			.remove( function (err, podcast) {
			  if (err) return console.log(err);
				res.send(true);
		});
	});


	// Display Edit podcast Form
	app.get('/podcast/:slug/edit', isLoggedIn, function(req, res) {
		Podcast
			.findOne({ slug: req.params.slug })
			.exec( function (err, podcast) {
			  if (err) {
			  	console.log(err);
				}
				res.render('podcast/edit.ejs', {
					user : req.user,
					podcast : podcast,
					page_type: 'column'
				});
		});
	});

	// Edit podcast
	app.post('/podcast/:slug/edit', isLoggedIn, function(req, res) {
		console.log('/podcast/:slug/edit: '+util.inspect(req.body));
		tmp_podcast = {};
		tmp_podcast.title = req.body.title;
		tmp_podcast.podcast = req.body.podcast;
		tmp_podcast.approved = req.body.approved;

		Podcast
			.findOne({ slug: req.params.slug })
			.exec(function (err, podcast) {
			  if (err) return console.log(err);
			  podcast.title = tmp_podcast.title;
				podcast.podcast = tmp_podcast.podcast;
				podcast.approved = tmp_podcast.approved;

			  podcast.save(function (err) {
	  			if (err) return console.log(err);
			  	res.redirect('/admin');
			  });
			});
	});

	app.get('/latest-podcast', function(req, res) {
		Podcast.find().where({approved: true}).sort({updated_date: -1}).limit(1).exec(function(err, podcast) {
			 if (err) return console.log(err);
			 res.json(podcast);
		});
	});


	// Display New Player Form
	app.get('/player/new', isLoggedIn, function(req, res) {
		res.render('player-new.ejs', {
			user: req.user,
			page_type: 'column'
		});
	});

	// Add New Player
	app.post('/player/new', isLoggedIn, function(req, res) {
		var name = req.body.name;
		var image_url = req.body.image_url;
		var description = req.body.description;
		var bio = req.body.bio;

		Player.create({ name: name, image_url: image_url, description: description, bio: bio }, function (err, player) {
		  if (err) return console.log(err);
		  res.send(player.id);
		});
	});


	// Display Player
	app.get('/player/:id', isLoggedIn, function(req, res) {
		Player.findById(req.params.id, function (err, player) {
		  if (err) return console.log(err);
			res.render('player.ejs', {
				user : req.user,
				player : player,
				page_type: 'column'
			});
		});
	});

	// Display Edit Player Form
	app.get('/player/:id/edit', isLoggedIn, function(req, res) {
		Player.findById(req.params.id, function (err, player) {
		  if (err) return console.log(err);
			res.render('player-edit.ejs', {
				user : req.user,
				player : player,
				page_type: 'column'
			});
		});
	});

	// Edit Column
	app.post('/player/:id/edit', isLoggedIn, function(req, res) {
		var name = req.body.name;
		var image_url = req.body.image_url;
		var description = req.body.description;
		var bio = req.body.bio;
		var published = req.body.published;

		Player.findByIdAndUpdate(req.params.id, { name: name, image_url: image_url, description: description, bio: bio, published: published }, function (err, player) {
		  if (err) return console.log(err);
		  res.send(player.id);
		});
	});

	// Display Player
	app.get('/writer/:slug', function(req, res) {
		Player
		.findOne({ slug: req.params.slug })
		.exec( function (err, writer) {
			Column.find({approved: true, type: 'column', player: writer._id }).sort({updated_date: -1}).exec(function(err, columns) {
			  	if (err) return console.log(err);
				res.render('writer.ejs', {
					user : req.user,
					writer : writer,
					columns: columns,
					page_type: 'column'
				});
			});
		});
	});




	// Add Post to User Grid
	app.post('/users/:user_id/post', function(req, res) {
		var title = req.body.title;
		var content = req.body.content;

		User.findById( req.params.user_id, function(err, this_user) {
			var tmp_post = new Post( { title: title, content: content, user: this_user._id } );
			tmp_post.save( function (err, this_post) {
			  if (err) return console.log(err);

			  this_user.things.push( { post: this_post._id, position: -1 } );
				this_user.save(function(err) {
	          res.redirect('/profile');
	      });
			})
		});
	});


	var s3 = knox.createClient({
	    key: auth.amazon.key,
	    secret: auth.amazon.secret,
	    bucket: auth.amazon.bucket
	});

	app.post('/image-upload', function(req, res, next) {
			console.log('req.body: ' + JSON.stringify(req.body));
			console.log('req.files: ' + JSON.stringify(req.files));
	    var photo = req.files.file;
	    console.log('photo: ' + JSON.stringify(photo));
	    var s3Headers = {
	      'x-amz-acl': 'public-read'
	    };

	    s3.putFile(photo.path, photo.name, s3Headers, function(err, s3response){
	      //handle, respond
	    });
	});


	var credential = {
    key: auth.amazon.key,
    secret: auth.amazon.secret,
    bucket: 'footballbyfootball-dev'
  };

// S3 Connector
var connect = function() {  
  return knox.createClient(credential);
};

// Remove Temp File
var removeTemp = function(path, callback) {  
  fs.unlink(path, function(err) {
    if (typeof callback === 'function') {
      process.nextTick(function() {
        callback(err);
      });
    }
  });
};

// Upload when '/upload' with POST requested
app.post('/upload', function(req, res){  
  var client = connect(),
      item = req.files.file,
      // append current timestamp to prevent filename conflicts
      filename = slugify(item.name) + Date.now();

  var localPath = item.path,
      s3Path = '/files/' + filename + '.' + mime.extension(item.type);

  async.waterfall([
    // Upload the file to S3
    function(callback) {
      client.putFile(
        localPath, s3Path, {'x-amz-acl': 'public-read'},
        function(err, result) {
          if (result.statusCode !== 200) {
            err = new Error('Upload Failure: ' + result.statusCode);
          }
          result.resume();
          callback(err);
        }
      )
    },

    // Remove the temp file on local
    function(callback) {
      removeTemp(localPath, function(err) {
        callback(err);
      });
    }
  ], function(err) {
    if (err) {
      res.send(500, 'upload failure');
    } else {
      // { saved: 'relative path of your bucket' }
      res.json({ saved: s3Path });
    }
  });
});




	// PROFILE SECTION =========================
	// app.get('/profile', isLoggedIn, function(req, res) {
	// 	if ( req.user.instagram.length ) {
	// 		InstagramGlobal.set('access_token', req.user.instagram.token );
	// 		InstagramGlobal.users.recent({ user_id: req.user.instagram.id,
	// 			complete: function(instagrams){

	// 				res.render('profile.ejs', {
	// 					player: req.user,
	// 					user : req.user,
	// 					instas: instagrams
	// 				});
	// 				console.log('req.user: '+req.user);
	// 			}
	// 		});
	// 	} else {
	// 		res.render('profile.ejs', {
	// 			user : req.user
	// 		});
	// 	}
	// });

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
			res.render('admin/profile.ejs', {
				player: req.user,
				user : req.user
			});
			console.log('req.user: '+req.user);
		
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/admin', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/admin', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// instagram ----------------------------
	
		// route for instagram authentication and login
		app.get('/auth/instagram', passport.authenticate('instagram', { scope : 'likes' }), 
			function(req, res){
	    // The request will be redirected to Instagram for authentication, so this
	    // function will not be called.
	  	});
		// handle the callback after instagram has authenticated the user
		app.get('/auth/instagram/callback',
			passport.authenticate('instagram', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// instagram -------------------------------

		// send to instagram to do the authentication
		app.get('/connect/instagram', passport.authorize('instagram', { scope : 'likes' }));

		// handle the callback after instagram has authorized the user
		app.get('/connect/instagram/callback',
			passport.authorize('instagram', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

  // instagram -------------------------------
  app.get('/unlink/instagram', function(req, res) {
      var user            = req.user;
      user.instagram.token = undefined;
      user.save(function(err) {
          res.redirect('/profile');
      });
  });

  app.get('/instagrams', function(req, res) {
		if ( req.user ) {
			InstagramGlobal.set('access_token', req.user.instagram.token );

			InstagramGlobal.users.self();

		}
  });

  app.get('/rss-generator', function(req, res) {

    // Initializing feed object
    var feed = new Feed({
        title:          'Football by Football',
        description:    'Football insight by Football Players',
        feed_url:       'http://www.footballbyfootball.com/rss',
       	site_url:       'http://www.footballbyfootball.com/',
        image_url:      'http://www.footballbyfootball.com/img/logo-masthead.png',
        copyright:      'Copyright © 2014 Football by Football, LLC. All rights reserved',
        generator: 			'bangarang' 
    });

		Column.find({approved: true}).sort({updated_date: 1}).populate('player').exec(function(err, columns) {
			if(err) { res.send('404 Not found', 404); }
			LockerRoom.find({approved: true}).sort({updated_date: 1}).populate('lockerentries.player').exec(function(err, lockerrooms) {
				if(err) { res.send('404 Not found', 404); }
				var entries = columns.concat(lockerrooms);

				var all_posts = entries.sort(function(a,b){
					if (moment(a.updated_date).valueOf() > moment(b.updated_date).valueOf()) return -1;
					if (moment(a.updated_date).valueOf() < moment(b.updated_date).valueOf()) return 1;
					return 0;
				});

				var posts = all_posts.splice(0,10);

		    for(var key in posts) {
		    	var description = '';	
	    		if (posts[key].type == 'lockerroom') {
	    			var url = 'http://www.footballbyfootball.com/lockerroom/'+posts[key].slug;
	    			var image = 'https://s3.amazonaws.com/footballbyfootball-dev/lockerroom/sansjags_backer.jpg';
	    			var description = '';
	    		} else {
	    				    			
	    			var url = 'http://www.footballbyfootball.com/column/'+posts[key].slug;
	    			// description = posts[key].data[0].content.replace(/<(?:.|\n)*?>/gm, '');
	    			for (x in posts[key].data) {
	    				if (posts[key].data[x].type == 'content') {
	    					description = description + posts[key].data[x].content.replace(/<(?:.|\n)*?>/gm, '');
	    				} else if (posts[key].data[x].type == 'image') {
	    				}
	    				
	    			}
	    			
	    			if (posts[key].main_image){ 
	    				var image = 'https://s3.amazonaws.com/footballbyfootball-dev'+posts[key].main_image.image_url;
	    			} else {
	    				var image = 'http://www.footballbyfootball.com/img/logo-masthead.png';
	    			}
	    		}
	    		var date = new Date(posts[key].updated_date);

          feed.item({
              title:          posts[key].title,
              image:          image,
              description:    description,
              url:           	url,
              date:          	date

          });
        }

        var result = feed.xml();

        // Sending the feed as a response
        res.send(result);

		});
    });

	});

	app.get('/rss', function(req, res){
		Column.find({approved: true}).sort({updated_date: 1}).populate('player').exec(function(err, columns) {
			if(err) { res.send('404 Not found', 404); }
			LockerRoom.find({approved: true}).sort({updated_date: 1}).populate('lockerentries.player').exec(function(err, lockerrooms) {
				if(err) { res.send('404 Not found', 404); }
				var entries = columns.concat(lockerrooms);

				var all_posts = entries.sort(function(a,b){
					if (moment(a.updated_date).valueOf() > moment(b.updated_date).valueOf()) return -1;
					if (moment(a.updated_date).valueOf() < moment(b.updated_date).valueOf()) return 1;
					return 0;
				});

				var posts = all_posts.splice(0,10);
				res.set({ 'content-type': 'text/xml; charset=utf-8' })
				req.setEncoding('utf-8');

				res.render('rss.ejs', {
					user : req.user,
					posts : posts
				});

			});
		});
	});

	//The 404 Route (ALWAYS Keep this as the last route)
	app.get('*', function(req, res){
	  res.status(404).render('error.ejs', {user : req.user});
	});

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}