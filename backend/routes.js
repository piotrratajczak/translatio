const express = require('express');
const router = express.Router();
const db = require('./db.js');
const config = require('./config.js');
const jwt = require('jsonwebtoken');

function langPost(req, res) {
	let payload = db.addLang(req.body.langCode);
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

//-------------login ----------------

router.post('/api/login', function(req, res) {
	apiFunction(req, res, logUser);
});

// ----------- lang ---------------------

router.get('/api/lang', (req, res) => res.send(db.getLangs())); //list
router.post('/api/lang', (req, res, next) => {
	apiFunction(req, res, langPost);
	next();
});
// ----------- downloads ------------------
router.get('/api/lang/file/:langCode', downloadLanguageFile);
//------------ lang / :LANGCODE ------------------
router.put('/api/lang/:langCode', (req, res, next) => {
	apiFunction(req, res, langPut);
	next();
});

//------------tag ----------------------
router.post('/api/tag', (req, res, next) => {
	apiFunction(req, res, tagPost);
	next();
});

//-----------extra features -----------
router.get('/api/extra/emptytags', (req, res) => {
	apiFunction(req, res, db.getEmptyTags);
});

// return info about incoherente tags
router.get('/api/extra/coherence', (req, res) => {
	apiFunction(req, res, db.checkCoherence);
});

// any other route
router.get('*', (req, res) => {
	res.status(404).send('404 Page not found');
});

module.exports = router;
