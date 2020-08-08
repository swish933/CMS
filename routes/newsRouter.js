const express = require('express');
const router = express.Router();
const {
	getAllNews,
	createNews,
	getNewsById,
	updateNewsById,
	deleteNewsById,
	getCreateNewsPage,
} = require('../controllers/newsController');
const isLoggedIn = require('../middleware/isAuthenticated');

router.all('/*', isLoggedIn, (req, res, next) => {
	next();
});

router.route('/').get(getAllNews);
router.route('/createNews').get(getCreateNewsPage).post(createNews);
router
	.route('/:id')
	.get(getNewsById)
	.put(updateNewsById)
	.delete(deleteNewsById);

module.exports = router;
