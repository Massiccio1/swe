const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
	console.log(req.url,req.body,req.params);
	// find the user
	if (!req.body.email) {
		res.status(401).json({ success: false, message: 'Authentication failed. no email given.' });
		return;
	}
	if (!req.body.password) {
		res.status(401).json({ success: false, message: 'Authentication failed. no password given.' });
		return;
	}

	let user = await Student.findOne({
		email: req.body.email
	});
	
	
	// user not found
	if (!user) {
		res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
		return;
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
		return;
	}

	let account_type = "student";
	
	// if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id,
		type: account_type
		// other data encrypted in the token	
	}
	
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
	 
	console.log(user);

	res.status(200).json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		type: account_type,
		self: "api/v1/" + user._id
	});
});



module.exports = router;