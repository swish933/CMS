const debug = require('debug')('app:publishRouter');
const bannerModel = require('../models/bannerModel');
const mediaModel = require('../models/mediaModel');
const logoModel = require('../models/logoModel');
const newsModel = require('../models/newsModel');

module.exports = {
	publish: async (req, res) => {
		let banners = await bannerModel.find({ active: true });
		let media = await mediaModel.find({ active: true });
		let news = await newsModel.find({ active: true });
		let logos = await logoModel.find({ active: true });

		res.json({
			banners,
			media,
			news,
			logos,
		});
	},
};
