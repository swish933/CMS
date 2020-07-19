const mongoose = require('mongoose');

const logoSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	logo: {
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
