const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isAuthenticated');
const authController = require('../controllers/authController');

router
	.route('/login')
	.get(authController.getLogin)
	.post(authController.postLogin);

/* GET Signup */
router
	.route('/signup')
	.get(authController.getSignup)
	.post(authController.postSignup);

/* GET Update page. */
router.route('/dashboard').get(authController.getAdminDashboard);

/* GET Logout Page */
router.route('/logout').get(isLoggedIn, authController.logout);

module.exports = router;
