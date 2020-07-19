const express = require('express');
const router = express.Router();
const bannerModel = require('../models/bannerModel');
const mediaModel = require('../models/mediaModel');
const logoModel = require('../models/logoModel');
const newsModel = require('../models/newsModel');
const isLoggedIn = require('../middleware/isAuthenticated');

router.get('/', (req, res) => {
	let news, banners, media, logos;

	bannerModel
		.find({ active: true })
		.then((doc) => {
			banners = doc;
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));

	mediaModel
		.find({ active: true })
		.then((doc) => {
			media = doc;
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));

	newsModel
		.find({ active: true })
		.then((doc) => {
			news = doc;
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));

	logoModel
		.find({ active: true })
		.then((doc) => {
			logos = doc;
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));

	res.status(200).json({
		media: media,
		news: news,
		logos: logos,
		banners: banners,
	});
});

module.exports = router;
