const express = require('express');
const router = express.Router();
const db = require('./db.js');
const config = require('./config.js');

//TODO
// connect io.emit with it.

function apiFunction(req, res, action) {
	let result = { error: null, success: true, data: {} };
	try {
		result.data = action(req);
	} catch (e) {
		result.error = e.toString();
		result.success = false;
	} finally {
		res.send(result);
	}
}

// ----------- lang ---------------------
router.get('/lang', (req, res) => res.send(db.getLangs())); //list
router.post('/lang', (req, res, next) => {
	apiFunction(req, res, req => db.addLang(req.body.langCode, config.filesUrl));
	next();
});

//------------ lang / :LANGCODE ------------------
router.put('/lang/:langCode', (req, res, next) => {
	apiFunction(req, res, req =>
		db.updateLang(req.params.langCode, req.body.data)
	);
	next();
});

//------------tag ----------------------
router.post('/tag', (req, res, next) => {
	apiFunction(req, res, req => db.addTag(req.body.tag));
	next();
});

//-----------extra features -----------
router.get('/extra/emptytags', (req, res) => {
	apiFunction(req, res, db.getEmptyTags);
});

// return info about incoherente tags
router.get('/extra/coherence', (req, res) => {
	apiFunction(req, res, db.checkCoherence);
});

// ---------- server home page --------------
router.get('/', (req, res) => {
	res.send({ response: 'Translation Server Works' }).status(200);
});

module.exports = router;
