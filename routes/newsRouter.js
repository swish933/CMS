const express = require('express');
const router = express.Router();
const debug = require('debug')('app:newsRouter');
const newsModel = require('../models/newsModel');
const isLoggedIn = require('../middleware/isAuthenticated');

// router.all('/*', isLoggedIn, (req, res, next) => {
// 	next();

// });

//GET all News
router.get('/', (req, res) => {
	newsModel
		.find()
		.then((news) => {
			res.status(200).json({ News: news });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

//GET active news
// router.get('/active', (req, res) => {
// 	newsModel
// 		.find({ active: true })
// 		.then((news) => {
// 			res.status(200).json({ activeNews: news });
// 		})
// 		.catch((err) => debug(`error : ${chalk.red(err)}`));
// });

//GET one news doc by id
router.get('/:id', (req, res) => {
	const { id } = req.params;
	newsModel
		.findById(id)
		.then((news) => {
			res.status(200).json({ news: news });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

//POST news
router.post('/', (req, res) => {
	const { category, content, active } = req.body;
	const show = active ? true : false;
	debug(show);
	new newsModel({
		category,
		content,
		active: show,
	})
		.save()
		.then((news) => {
			res.status(200).json({ News: news });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

//PUT (Update) content of one news doc
router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { category, content, active } = req.body;
	const show = active ? true : false;
	debug(show);
	newsModel
		.updateOne(
			{ _id: id },
			{ content: content, category: category, active: show }
		)
		.then((doc) => res.send(doc))
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

//Delete one news doc
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	newsModel
		.deleteOne({ _id: id })
		.then((doc) => {
			res.status(200).json({ Deleted: doc });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

module.exports = router;
