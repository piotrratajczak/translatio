const express = require('express');
const apiRoutes = express.Router();
const db = require('./db.js');
const config = require('./config.js');
const jwt = require('jsonwebtoken');

function langPost(req, res) {
	let payload = db.addLang(req.body);
	res.locals.toEmit = { payload, type: 'data/SOCKET_LANG_ADDED' };
	return payload;
}

function langPut(req, res) {
	let payload = db.updateLang({
		langCode: req.params.langCode,
		data: req.body.data
	});
	if (payload) {
		res.locals.toEmit = { payload, type: 'data/SOCKET_LANG_UPDATED' };
	}

	return payload;
}

function tagPost(req, res) {
	let payload = db.addTag(req.body);
	res.locals.toEmit = { payload, type: 'data/SOCKET_TAG_ADDED' };
	return payload;
}

function logUser(req, res) {
	let { email, password } = req.body;
	let token = null;
	const profile = db.checkUser(email, password);

	if (profile) {
		token = jwt.sign(profile, config.jwtSecret, { expiresIn: 60 * 60 });
	}

	return token;
}

function apiFunction(req, res, action) {
	let result = { error: null, success: true, data: {} };
	try {
		result.data = action(req, res);
	} catch (e) {
		result.error = e.toString();
		result.success = false;
	} finally {
		res.send(result);
	}
}

function downloadLanguageFile(req, res) {
	const langCode = req.params.langCode;
	if (db.langExist(langCode)) {
		res.download(
			config.filesUrl + '/' + langCode + '.json',
			langCode + '.json'
		);
	} else {
		res.send('there is no such a language!');
	}
}

//----------JWT verification ------------
function checkJWT(req, res, next) {
	// check header or url parameters or post parameters for token
	var token =
		req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.jwtSecret, function(err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
}

//-------------login ----------------

apiRoutes.post('/api/login', function(req, res) {
	apiFunction(req, res, logUser);
});

// ----------- lang ---------------------

apiRoutes.get('/api/lang', (req, res) => res.send(db.getLangs())); //list
apiRoutes.post('/api/lang', checkJWT, (req, res, next) => {
	apiFunction(req, res, langPost);
	next();
});
// ----------- downloads ------------------
apiRoutes.get('/api/lang/file/:langCode', downloadLanguageFile);
//------------ lang / :LANGCODE ------------------
apiRoutes.put('/api/lang/:langCode', checkJWT, (req, res, next) => {
	apiFunction(req, res, langPut);
	next();
});

//------------tag ----------------------
apiRoutes.post('/api/tag', checkJWT, (req, res, next) => {
	apiFunction(req, res, tagPost);
	next();
});

//-----------extra features -----------
apiRoutes.get('/api/extra/emptytags', (req, res) => {
	apiFunction(req, res, db.getEmptyTags);
});

// return info about incoherente tags
apiRoutes.get('/api/extra/coherence', (req, res) => {
	apiFunction(req, res, db.checkCoherence);
});

// any other route
apiRoutes.get('*', (req, res) => {
	res.status(404).send('404 Page not found');
});

module.exports = apiRoutes;
