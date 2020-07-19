const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	media: {
		type: String,
		trim: true,
		required: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Media', mediaSchema);
