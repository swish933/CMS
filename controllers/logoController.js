const LogoModel = require('../models/logoModel');
const debug = require('debug')('app:logoController');
const chalk = require('chalk');
const isEmpty = require('is-empty');
const fs = require('fs');

module.exports = {
	getUploadLogoPage: (req, res) => {
		res.render('logo/uploadLogo', { user: req.user });
	},

	getAllLogos: (req, res) => {
		LogoModel.find()
			.then((logos) => {
				res.render('logo/logoView', { logos: logos, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	uploadLogo: (req, res) => {
		let filename = '';
		const { name, active } = req.body;
		const show = active ? true : false;

		if (!isEmpty(req.files)) {
			let file = req.files.uploadedFile;
			filename = file.name;
			let uploadDir = './public/uploads/logos/';

			file.mv(uploadDir + filename, (err) => {
				if (err) throw err;
			});

			new LogoModel({
				name: name,
				logoPath: `/public/uploads/logos/${filename}`,
				active: show,
			})
				.save()
				.then((logo) => {
					res.redirect('/logo');
				})
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		} else {
			res.send({ Error: 'err' });
		}
	},

	getLogoById: (req, res) => {
		const { id } = req.params;
		LogoModel.findById(id)
			.then((logo) => {
				res.render('logo/editLogo', { logo: logo, user: req.user });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},

	updateLogo: (req, res) => {
		const { id } = req.params;
		const { name, active } = req.body;
		const show = active ? true : false;

		if (!isEmpty(req.files)) {
			LogoModel.findById(id)
				.then((doc) => {
					let path = `.${doc.logoPath}`;
					fs.stat(path, (err) => {
						fs.unlink(path, (err) => {
							if (err) {
								debug(err);
							}
							debug(`${chalk.red(`File deleted`)}`);
						});
					});
				})
				.then(() => {
					let file = req.files.uploadedFile;
					let filename = file.name;
					let uploadDir = './public/uploads/logos/';

					file.mv(uploadDir + filename, (err) => {
						if (err) throw err;
					});

					const data = {
						name: name,
						logoPath: `/public/uploads/logos/${filename}`,
						active: show,
					};

					LogoModel.updateOne({ _id: id }, data)
						.then(() => res.redirect('/logo'))
						.catch((err) => debug(`error : ${chalk.red(err)}`));
				})
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		} else {
			const data = {
				active: show,
				name: name,
			};
			LogoModel.updateOne({ _id: id }, data)
				.then(() => res.redirect('/logo'))
				.catch((err) => debug(`error : ${chalk.red(err)}`));
		}
	},

	deleteLogo: (req, res) => {
		const { id } = req.params;
		LogoModel.findById(id)
			.then((doc) => {
				let path = `.${doc.logoPath}`;
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

		LogoModel.deleteOne({ _id: id })
			.then(() => res.redirect('/logo'))
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	},
};
