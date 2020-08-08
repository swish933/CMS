const Validator = require('validator');
const isEmpty = require('is-empty');

const validateLoginInput = (data) => {
	const errors = {};
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	const { email, password } = data;

	if (Validator.isEmpty(email)) {
		errors.email = 'Email field is required';
	} else if (!Validator.isEmail(email)) {
		errors.email = 'Email is invalid';
	}

	//password checks
	if (Validator.isEmpty(password)) {
		errors.password = 'Password field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateLoginInput;
