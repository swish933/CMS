const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const isLoggedIn = require('../middleware/isAuthenticated');

router.all('/*', isLoggedIn, (req, res, next) => {
	next();
});

router
	.route('/')
	.get(bannerController.getAllBanners)
	.post(bannerController.uploadBanner);

router
	.route('/:id')
	.get(bannerController.getBannerById)
	.put(bannerController.updateBanner)
	.delete(bannerController.deleteBanner);

module.exports = router;
