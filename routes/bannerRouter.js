const express = require('express');
const router = express.Router();
const BannerModel = require('../models/bannerModel');
const debug = require('debug')('app:bannerRouter');
const chalk = require('chalk');
const isEmpty = require('is-empty');
const fs = require('fs');
// const isLoggedIn = require('../middleware/isAuthenticated');

// router.all('/*', isLoggedIn, (req, res, next) => {
// 	next();
// });

router.get('/', (req, res) => {
	BannerModel.find()
		.then((banner) => {
			res.status(200).json({ Banners: banner });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

// router.get('/active', (req, res) => {
// 	BannerModel.find({ active: true })
// 		.then((banners) => {
// 			res.status(200).json({ activeBanners: banners });
// 		})
// 		.catch((err) => debug(`error : ${chalk.red(err)}`));
// });

router.get('/:id', (req, res) => {
	const { id } = req.params;
	BannerModel.findById(id)
		.then((banner) => {
			res.status(200).json({ Banner: banner });
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
		let uploadDir = './public/uploads/banners/';

		file.mv(uploadDir + filename, (err) => {
			if (err) throw err;
		});

		new BannerModel({
			name: filename,
			banner: `uploads/banners/${filename}`,
			active: show,
		})
			.save()
			.then((banner) => {
				res.json({ Banner: banner, message: 'File Uploaded' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	}
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { active } = req.body;
	const show = active ? true : false;

	if (!isEmpty(req.files)) {
		BannerModel.findById(id)
			.then((doc) => {
				let path = `./public/${doc.banner}`;
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
		let uploadDir = './public/uploads/banners/';

		file.mv(uploadDir + filename, (err) => {
			if (err) throw err;
		});

		const data = {
			name: filename,
			banner: `uploads/banners/${filename}`,
			active: show,
		};

		BannerModel.updateOne({ _id: id }, data)
			.then((doc) => {
				res
					.status(200)
					.json({ Updated: doc, message: 'Updated image and status' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	} else {
		BannerModel.updateOne({ _id: id }, { active: show })
			.then((doc) => {
				res.status(200).json({ Updated: doc, message: 'Only status updated' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	}
});

//Delete one banner from server and DB
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	BannerModel.findById(id)
		.then((doc) => {
			let path = `./public/${doc.banner}`;
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
		.then((doc) => {
			res
				.status(200)
				.json({ Deleted: doc, message: 'File deleted succesfully' });
		})
		.catch((err) => {});
});

module.exports = router;
