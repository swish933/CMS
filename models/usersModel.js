// Import Mongoose and password Encrypt
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for User model
var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
});

// Encrypt Password
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Verify if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
