const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
	
	// find the user
	let tutor = await Tutor.findOne({
		email: req.body.email
	}).exec();
	
	
	// user not found
	if (!tutor) {
		res.json({ success: false, message: 'Authentication failed. Tutor not found.' });
		return;
	}
	
	// check if password matches
	if (tutor.password != req.body.password) {
		res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	}

	let account_type = "tutor";
	
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

	res.json({
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