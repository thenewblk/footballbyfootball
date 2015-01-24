// config/database.js
module.exports = {

	 'url' : 
	 			process.env.MONGOLAB_URI || 
	 			process.env.MONGOHQ_URL
};