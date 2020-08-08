// load passport module
const LocalStrategy = require('passport-local').Strategy; // load up the user model
const User = require('../models/usersModel');

module.exports = function (passport) {
	// passport init setup
	// serialize the user for the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	//deserialize the user
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// using local strategy
	passport.use(
		'local-login',
		new LocalStrategy(
			{
				// change default username and password, to email
				//and password
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			function (req, email, password, done) {
				if (email)
					// format to lower-case
					email = email.toLowerCase(); // process asynchronous
				process.nextTick(function () {
					User.findOne({ email: email }, function (err, user) {
						// if errors
						if (err) return done(err); // check errors and bring the messages
						if (!user)
							return done(
								null,
								false,
								req.flash('loginMessage', 'No user found.')
							);
						if (!user.validPassword(password))
							return done(
								null,
								false,
								req.flash('loginMessage', 'Wohh! Wrong password.')
							);
						// everything ok, get user
						else return done(null, user);
					});
				});
			}
		)
	); // Signup local strategy
	passport.use(
		'local-signup',
		new LocalStrategy(
			{
				// change default username and password, to email and
				//  password
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			function (req, email, password, done) {
				if (email)
					// format to lower-case
					email = email.toLowerCase(); // asynchronous
				process.nextTick(function () {
					// if the user is not already logged in:
					if (!req.user) {
						User.findOne({ email: email }, function (err, user) {
							// if errors
							if (err) return done(err);
							// check email
							if (user) {
								return done(
									null,
									false,
									req.flash(
										'signupMessage',
										'Wohh! the email is already taken.'
									)
								);
							} else {
								// create the user
								const newUser = new User();
								// Get user name from req.body
								newUser.firstName = req.body.firstName;
								newUser.lastName = req.body.lastName;
								newUser.email = email;
								newUser.password = newUser.generateHash(password);
								// save data
								newUser.save(function (err) {
									if (err) throw err;
									return done(null, newUser);
								});
							}
						});
					} else {
						return done(null, req.user);
					}
				});
			}
		)
	);
};
