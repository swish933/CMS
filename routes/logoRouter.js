const express = require('express');
const router = express.Router();
const LogoModel = require('../models/logoModel');
const debug = require('debug')('app:bannerRouter');
const chalk = require('chalk');
const isEmpty = require('is-empty');
const fs = require('fs');
const isLoggedIn = require('../middleware/isAuthenticated');

// router.all('/*', isLoggedIn, (req, res, next) => {
// 	next();
// });

router.get('/', (req, res) => {
	LogoModel.find()
		.then((logos) => {
			res.status(200).json({ Logos: logos });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

// router.get('/active', (req, res) => {
// 	LogoModel.find({ active: true })
// 		.then((logos) => {
// 			res.status(200).json({ activeLogos: logos });
// 		})
// 		.catch((err) => debug(`error : ${chalk.red(err)}`));
// });

router.get('/:id', (req, res) => {
	const { id } = req.params;
	LogoModel.findById(id)
		.then((logo) => {
			res.status(200).json({ Logo: logo });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

router.post('/', (req, res) => {
	let filename = '';
	const { active } = req.body;
	const show = active ? true : false;

	if (!isEmpty(req.files)) {
		let file = req.files.uploadedFile;
		filename = file.name;
		let uploadDir = './public/uploads/logos/';

		file.mv(uploadDir + filename, (err) => {
			if (err) throw err;
		});

		new LogoModel({
			name: filename,
			logo: `uploads/logos/${filename}`,
			active: show,
		})
			.save()
			.then((logo) => {
				res.status(200).json({ Logo: logo, message: 'File Uploaded' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	} else {
		res.send({ Error: 'err' });
	}
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { active } = req.body;
	const show = active ? true : false;

	if (!isEmpty(req.files)) {
		LogoModel.findById(id)
			.then((doc) => {
				let path = `./public/${doc.logo}`;
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

		let file = req.files.uploadedFile;
		let filename = file.name;
		let uploadDir = './public/uploads/logos/';

		file.mv(uploadDir + filename, (err) => {
			if (err) throw err;
		});

		const data = {
			name: filename,
			logo: `uploads/logos/${filename}`,
			active: show,
		};

		LogoModel.updateOne({ _id: id }, data)
			.then((doc) => {
				res
					.status(200)
					.json({ Updated: doc, message: 'Updated image and status' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	} else {
		LogoModel.updateOne({ _id: id }, { active: show })
			.then((doc) => {
				res.status(200).json({ Updated: doc, message: 'Only status updated' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	}
});

//Delete one banner from server and DB
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	LogoModel.findById(id)
		.then((doc) => {
			let path = `./public/${doc.logo}`;
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
		.then((doc) => {
			res
				.status(200)
				.json({ Deleted: doc, message: 'File deleted succesfully' });
		})
		.catch((err) => {});
});

module.exports = router;
