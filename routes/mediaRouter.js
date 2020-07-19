const express = require('express');
const router = express.Router();
const mediaModel = require('../models/mediaModel');
const debug = require('debug')('app:bannerRouter');
const chalk = require('chalk');
const isEmpty = require('is-empty');
const fs = require('fs');
const isLoggedIn = require('../middleware/isAuthenticated');

// router.all('/*', isLoggedIn, (req, res, next) => {
// 	next();
// });

router.get('/', (req, res) => {
	mediaModel
		.find()
		.then((media) => {
			res.status(200).json({ Media: media });
		})
		.catch((err) => debug(`error : ${chalk.red(err)}`));
});

// router.get('/active', (req, res) => {
// 	mediaModel
// 		.find({ active: true })
// 		.then((media) => {
// 			res.status(200).json({ activeMedia: media });
// 		})
// 		.catch((err) => debug(`error : ${chalk.red(err)}`));
// });

router.get('/:id', (req, res) => {
	const { id } = req.params;
	mediaModel
		.findById(id)
		.then((media) => {
			res.status(200).json({ Media: media });
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
		let uploadDir = './public/uploads/media/';

		file.mv(uploadDir + filename, (err) => {
			if (err) throw err;
		});

		new mediaModel({
			name: filename,
			media: `uploads/media/${filename}`,
			active: show,
		})
			.save()
			.then((media) => {
				res.status(200).json({ Media: media, message: 'File Uploaded' });
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
		mediaModel
			.findById(id)
			.then((doc) => {
				let path = `./public/${doc.media}`;
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
		let uploadDir = './public/uploads/media/';

		file.mv(uploadDir + filename, (err) => {
			if (err) throw err;
		});

		const data = {
			name: filename,
			media: `uploads/media/${filename}`,
			active: show,
		};

		mediaModel
			.updateOne({ _id: id }, data)
			.then((doc) => {
				res
					.status(200)
					.json({ Updated: doc, message: 'Updated image and status' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	} else {
		mediaModel
			.updateOne({ _id: id }, { active: show })
			.then((doc) => {
				res.status(200).json({ Updated: doc, message: 'Only status updated' });
			})
			.catch((err) => debug(`error : ${chalk.red(err)}`));
	}
});

//Delete one banner from server and DB
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	mediaModel
		.findById(id)
		.then((doc) => {
			let path = `./public/${doc.media}`;
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

	mediaModel
		.deleteOne({ _id: id })
		.then((doc) => {
			res
				.status(200)
				.json({ Deleted: doc, message: 'File deleted succesfully' });
		})
		.catch((err) => {});
});

module.exports = router;
