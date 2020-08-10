const express = require('express');
const router = express.Router();
const publishController = require('../controllers/publishController');

const isLoggedIn = require('../middleware/isAuthenticated');

router.all('/*', isLoggedIn, (req, res) => {
	next();
});

router.route('/').get(isLoggedIn, publishController.publish);

module.exports = router;
