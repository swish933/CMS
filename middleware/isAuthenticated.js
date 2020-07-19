/* check if user is logged in */
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

module.exports = isAuthenticated;
