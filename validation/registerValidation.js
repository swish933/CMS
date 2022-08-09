const Validator = require('validator');
const isEmpty = require('is-empty');
const e = require('express');

const validateRegisterInput = (data) => {
	const errors = {};
	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	const { name, email, password, password2 } = data;

	//Name checks
	if (Validator.isEmpty(name)) {
		errors.name = 'Name field is required';
	}
	//Email checks
	if (Validator.isEmpty(email)) {
		errors.email = 'Email field is required';
	} else if (!Validator.isEmail(email)) {
		errors.email = 'Email is invalid';
	}

	//password checks
	if (Validator.isEmpty(password)) {
		errors.password = 'Password field is required';
	}

	if (Validator.isEmpty(password2)) {
		errors.password2 = 'Confirm password field is required';
	}

	if (!Validator.isLength(password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters';
	}

	if (Validator.notStrictEqual(password, password2)) {
		errors.password2 = 'Passwords must match';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateRegisterInput;
