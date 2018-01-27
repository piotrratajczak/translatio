const express = require('express');
const router = express.Router();
const db = require('./db.js');

function langPost(req, res) {
	let result = { error: null, success: true };
	const langCode = req.body.langCode;

	let newLang = db.addLang(langCode, config.filesUrl);
	// emit event
	// io.emit('dbEvent', {
	// 	type: 'LANGUAGE_ADDED',
	// 	data: { [langCode]: newLang }
	// });

	res.send(result);
}

function langPut(req, res) {
	const data = req.body.data;
	const langCode = req.params.langCode;

	let payload = db.updateLang(langCode, data);
	// io.emit('dbEvent', {
	// 	type: 'LANG_UPDATE',
	// 	data: payload
	// });

	return {};
}

function tagPost(req) {
	let payload = db.addTag(req.body.tag);
	// io.emit('dbEvent', { type: 'TAG_ADDED', data: payload });
	return {};
}

function apiFunction(req, res, action, sendRes = true) {
	let result = { error: null, success: true, data: {} };
	try {
		result = Object.assign(result, action(req, res));
	} catch (e) {
		result.error = e.toString();
		result.success = false;
		res.send(result);
	} finally {
		if (sendRes || result.error) {
			res.send(result);
		}
	}
}

// ----------- lang ---------------------
router.get('/lang', (req, res) => res.send(db.getLangs())); //list
//TODO  fix all this asynchronous stuff with params
router.post('/lang', (req, res, next) => {
	apiFunction(req, res, langPost, false);
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
	apiFunction(req, res, () => {
		return { data: db.getEmptyTags() };
	});
});

// return info about incoherente tags
router.get('/extra/coherence', (req, res) => {
	apiFunction(req, res, () => {
		return { data: db.checkCoherence() };
	});
});

// ---------- server home page --------------
router.get('/', (req, res) => {
	res.send({ response: 'Translation Server Works' }).status(200);
});

module.exports = router;
