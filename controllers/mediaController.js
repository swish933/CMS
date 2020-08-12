const MediaModel = require('../models/mediaModel');
const debug = require('debug')('app:mediaController');
const chalk = require('chalk');
const isEmpty = require('is-empty');
const fs = require('fs');

module.exports = {
	getUploadMediaPage: (req, res) => {
		res.render('media/uploadMedia', { user: req.user });
	},

	getAllMedia: (req, res) => {
		MediaModel.find()
			.then((media) => {
				res.render('media/mediaView', { media: media, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	uploadMedia: (req, res) => {
		let filename = '';
		const { name, active } = req.body;
		const show = active ? true : false;

		if (!isEmpty(req.files)) {
			let file = req.files.uploadedFile;
			filename = file.name;
			let uploadDir = './public/uploads/media/';

			file.mv(uploadDir + filename, (err) => {
				if (err) throw err;
			});

			new MediaModel({
				name: name,
				mediaPath: `/uploads/media/${filename}`,
				active: show,
			})
				.save()
				.then(() => res.redirect('/media'))
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		} else {
			res.send({ Error: 'err' });
		}
	},

	getMediaById: (req, res) => {
		const { id } = req.params;
		MediaModel.findById(id)
			.then((media) => {
				res.render('media/editMedia', { media: media, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	updateMedia: (req, res) => {
		const { id } = req.params;
		const { name, active } = req.body;
		const show = active ? true : false;

		if (!isEmpty(req.files)) {
			MediaModel.findById(id)
				.then((doc) => {
					let path = `./public${doc.mediaPath}`;
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
					let uploadDir = './public/uploads/media/';

					file.mv(uploadDir + filename, (err) => {
						if (err) throw err;
					});

					const data = {
						name: name,
						mediaPath: `/uploads/media/${filename}`,
						active: show,
					};

					MediaModel.updateOne({ _id: id }, data)
						.then((doc) => {
							res
								.status(200)
								.json({ Updated: doc, message: 'Updated image and status' });
						})
						.catch((err) => debug(`error : ${chalk.red(err)}`));
				})
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		} else {
			const data = {
				active: show,
				name: name,
			};
			MediaModel.updateOne({ _id: id }, data)
				.then(() => res.redirect('/media'))
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		}
	},

	deleteMedia: (req, res) => {
		const { id } = req.params;
		MediaModel.findById(id)
			.then((doc) => {
				let path = `./public${doc.mediaPath}`;
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

		MediaModel.deleteOne({ _id: id })
			.then(() => res.redirect('/media'))
			.catch((err) => {});
	},
};
