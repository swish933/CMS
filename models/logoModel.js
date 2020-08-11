const mongoose = require('mongoose');

const logoSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	logoPath: {
		type: String,
		trim: true,
		required: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Logo', logoSchema);
