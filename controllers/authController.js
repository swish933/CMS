const passport = require('passport');

module.exports = {
	logout: (req, res) => {
		req.logout();
		res.redirect('/login');
	},

	getLogin: (req, res, next) => {
		res.render('login', {
			title: 'Login Page',
			message: req.flash('loginMessage'),
			layout: false,
		});
	},

	postLogin: passport.authenticate('local-login', {
		//Success go to Profile Page / Fail go to login page
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true,
	}),

	getSignup: (req, res) => {
		res.render('register', {
			title: 'Signup Page',
			message: req.flash('signupMessage'),
			layout: false,
		});
	},
	postSignup: passport.authenticate('local-signup', {
		//Success go to Profile Page / Fail go to Signup page
		successRedirect: '/dashboard',
		failureRedirect: '/signup',
		failureFlash: true,
	}),

	getAdminDashboard: (req, res, next) => {
		res.render('dashView', {
			title: 'Admin Dashboard',
			user: req.user,
			message: req.flash('loginMessage'),
		});
	},
};
