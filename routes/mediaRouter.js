const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

const isLoggedIn = require('../middleware/isAuthenticated');

router.all('/*', isLoggedIn, (req, res, next) => {
	next();
});

router
	.route('/')
	.get(mediaController.getAllMedia)
	.post(mediaController.uploadMedia);

router
	.route('/:id')
	.get(mediaController.getMediaById)
	.put(mediaController.updateMedia)
	.delete(mediaController.deleteMedia);

module.exports = router;
