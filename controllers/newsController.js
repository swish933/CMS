const debug = require('debug')('app:newsRouter');
const newsModel = require('../models/newsModel');
const chalk = require('chalk');

module.exports = {
	getCreateNewsPage: (req, res) => {
		res.render('createNews', { user: req.user });
	},

	// getUploadMediaPage: (req, res) => {
	// 	res.render('uploadMedia', { user: req.user });
	// },

	// getUploadBannerPage: (req, res) => {
	// 	res.render('uploadBanner', { user: req.user });
	// },

	// getUploadLogoPage: (req, res) => {
	// 	res.render('uploadLogo', { user: req.user });
	// },

	getAllNews: (req, res) => {
		newsModel
			.find()
			.then((news) => {
				res.render('newsView', { news: news, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	createNews: (req, res) => {
		const { category, content, active } = req.body;
		const show = active ? true : false;
		new newsModel({
			category,
			content,
			active: show,
		})
			.save()
			.then((news) => {
				res.redirect('/news');
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	getNewsById: (req, res) => {
		const { id } = req.params;
		newsModel
			.findById(id)
			.then((news) => {
				res.render('editNews', { news: news, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},
	updateNewsById: (req, res) => {
		const { id } = req.params;
		const { category, content, active } = req.body;
		const show = active ? true : false;
		newsModel
			.updateOne(
				{ _id: id },
				{ content: content, category: category, active: show }
			)
			.then((doc) => res.redirect('/news'))
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},
	deleteNewsById: (req, res) => {
		const { id } = req.params;
		newsModel
			.deleteOne({ _id: id })
			.then((doc) => {
				res.redirect('/news');
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},
};
