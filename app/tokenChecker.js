const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const tokenChecker = (role) => {
	return(req, res, next) => {
	
	//const token = req.cookies.token;
	// check header or url parameters or post parameters for token
	var token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];

	// if there is no token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'No token provided.',
			extra: 'url: ' + req.url +"   body: " + req.body + "   param: " + req.params
		});
	}

	//console.log("[from token checker] req: " ,req.url,req.body,req.params);

	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});		
		} else {
			// if everything is good, save to request for use in other routes
			req.loggedUser = decoded;
			console.log("[from token checker] logged user: ",decoded);
			if((role=='student'&&decoded.type=='student')||
			(role=='tutor'&&decoded.type=='tutor') ||
			(role=='s-t'&&decoded.type=='tutor') || 
			(role=='s-t'&&decoded.type=='student')){
				next();
			} else{
				return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});	
			}
		}
	});
};

};

module.exports = tokenChecker