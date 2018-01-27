const express = require('express');
const router = express.Router();
const db = require('./db.js');

// ----------- lang ---------------------
router.get('/lang', (req, res) => res.send(db.getLangs())); //list
router.post('/lang', (req, res) => {
	apiFunction(req, res, langPost, false); // fix all this asynchronous stuff with params
});

//------------ lang / :LANGCODE ------------------
router.put('/lang/:langCode', (req, res) => {
	apiFunction(req, res, langPut);
});

//------------tag ----------------------
router.post('/tag', (req, res) => {
	apiFunction(req, res, tagPost);
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
