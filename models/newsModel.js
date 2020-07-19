const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
	category: { type: String },
	content: {
		type: String,
		trim: true,
		required: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('News', newsSchema);
