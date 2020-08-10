const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const isLoggedIn = require('../middleware/isAuthenticated');

router.all('/*', isLoggedIn, (req, res, next) => {
	next();
});

router.route('/').get(newsController.getAllNews);
router
	.route('/createNews')
	.get(newsController.getCreateNewsPage)
	.post(newsController.createNews);
router
	.route('/:id')
	.get(newsController.getNewsById)
	.put(newsController.updateNews)
	.delete(newsController.deleteNews);

module.exports = router;
