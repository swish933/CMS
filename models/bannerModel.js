const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	bannerPath: {
		type: String,
		trim: true,
		required: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Banner', bannerSchema);
