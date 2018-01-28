const express = require('express');
const router = express.Router();
const db = require('./db.js');
const config = require('./config.js');

function langPost(req, res) {
	let payload = db.addLang(req.body.langCode);
	res.locals.toEmit = { payload, eventType: 'LANG_ADDED' };
	return payload;
}

function langPut(req, res) {
	let payload = db.updateLang(req.params.langCode, req.body.data);
	res.locals.toEmit = { payload, eventType: 'LANG_UPDATED' };
	return payload;
}

function tagPost(req, res) {
	let payload = db.addTag(req.body.tag);
	res.locals.toEmit = { payload, eventType: 'TAG_ADDED' };
	return payload;
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

// ----------- lang ---------------------
router.get('/lang', (req, res) => res.send(db.getLangs())); //list
router.post('/lang', (req, res, next) => {
	apiFunction(req, res, langPost);
	next();
});

//------------ lang / :LANGCODE ------------------
router.put('/lang/:langCode', (req, res, next) => {
	apiFunction(req, res, langPut);
	next();
});

//------------tag ----------------------
router.post('/tag', (req, res, next) => {
	apiFunction(req, res, tagPost);
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
