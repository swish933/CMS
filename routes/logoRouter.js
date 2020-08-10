const express = require('express');
const router = express.Router();
const logoController = require('../controllers/logoController');

const isLoggedIn = require('../middleware/isAuthenticated');

router.all('/*', isLoggedIn, (req, res, next) => {
	next();
});

router
	.route('/')
	.get(logoController.getAllLogos)
	.post(logoController.uploadLogo);

router
	.route('/:id')
	.get(logoController.getLogoById)
	.put(logoController.updateLogo)
	.delete(logoController.deleteLogo);

module.exports = router;
