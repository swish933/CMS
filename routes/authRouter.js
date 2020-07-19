const express = require('express');
const passport = require('passport');

const router = express.Router();
const isLoggedIn = require('../middleware/isAuthenticated');

/* GET login page. */
router.get('/', function (req, res, next) {
	res.render('login', {
		title: 'Login Page',
		message: req.flash('loginMessage'),
	});
});

/* POST login */
router.post(
	'/login',
	passport.authenticate('local-login', {
		//Success go to Profile Page / Fail go to login page
		successRedirect: '/update',
		failureRedirect: '/login',
		failureFlash: true,
	})
);

/* GET Signup */
router.get('/signup', function (req, res) {
	res.render('signup', {
		title: 'Signup Page',
		message: req.flash('signupMessage'),
	});
});

/* POST Signup */
router.post(
	'/signup',
	passport.authenticate('local-signup', {
		//Success go to Profile Page / Fail go to Signup page
		successRedirect: '/update',
		failureRedirect: '/signup',
		failureFlash: true,
	})
);

/* GET Update page. */
router.get('/update', isLoggedIn, function (req, res, next) {
	res.render('update', {
		title: 'Update Page',
		user: req.user,
		avatar: gravatar.url(
			req.user.email,
			{ s: '100', r: 'x', d: 'retro' },
			true
		),
	});
});

/* GET Logout Page */
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
