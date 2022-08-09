const BannerModel = require('../models/bannerModel');
const debug = require('debug')('app:bannerController');
const chalk = require('chalk');
const isEmpty = require('is-empty');
const fs = require('fs');

module.exports = {
	getUploadBannerPage: (req, res) => {
		res.render('banner/uploadBanner', { user: req.user });
	},

	getAllBanners: (req, res) => {
		BannerModel.find()
			.then((banner) => {
				res.render('banner/bannerView', { banners: banner, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	uploadBanner: (req, res) => {
		let filename = '';
		const { name, active } = req.body;
		const show = active ? true : false;

		if (!isEmpty(req.files)) {
			let file = req.files.uploadedFile;
			filename = file.name;
			let uploadDir = './public/uploads/banners/';

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir);
			}

			file.mv(uploadDir + filename, (err) => {
				if (err) throw err;
			});

			new BannerModel({
				name: name,
				bannerPath: `/uploads/banners/${filename}`,
				active: show,
			})
				.save()
				.then(() => res.redirect('/banner'))
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		}
	},

	getBannerById: (req, res) => {
		const { id } = req.params;
		BannerModel.findById(id)
			.then((banner) => {
				res.render('banner/editBanner', { banner: banner, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	updateBanner: (req, res) => {
		const { id } = req.params;
		const { name, active } = req.body;
		const show = active ? true : false;

		if (!isEmpty(req.files)) {
			BannerModel.findById(id)
				.then((doc) => {
					let path = `./public${doc.bannerPath}`;
					fs.stat(path, (err) => {
						fs.unlink(path, (err) => {
							if (err) {
								debug(err);
							}
							console.log('File deleted');
						});
					});
				})
				.then(() => {
					let file = req.files.uploadedFile;
					let filename = file.name;
					let uploadDir = './public/uploads/banners/';

					file.mv(uploadDir + filename, (err) => {
						if (err) throw err;
					});

					const data = {
						name: name,
						bannerPath: `/uploads/banners/${filename}`,
						active: show,
					};

					BannerModel.updateOne({ _id: id }, data)
						.then(() => res.redirect('/banner'))
						.catch((err) => debug(`error : ${chalk.red(err)}`));
				})
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		} else {
			const data = {
				active: show,
				name: name,
			};
			BannerModel.updateOne({ _id: id }, data)
				.then(() => res.redirect('/banner'))
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		}
	},
	deleteBanner: (req, res) => {
		const { id } = req.params;
		BannerModel.findById(id)
			.then((doc) => {
				let path = `./public${doc.bannerPath}`;
				fs.stat(path, (err) => {
					fs.unlink(path, (err) => {
						if (err) {
							debug(err);
						}
						console.log('File deleted');
					});
				});
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));

		BannerModel.deleteOne({ _id: id })
			.then(() => res.redirect('/banner'))
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},
};
