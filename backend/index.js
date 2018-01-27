const config = require('./config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const helpers = require('./helpers');
const db = require('./db');

function langPost(req, res) {
	let result = { error: null, success: true };
	const langCode = req.body.langCode;

	let newLang = db.addLang(langCode, config.filesUrl);
	// emit event
	io.emit('dbEvent', {
		type: 'LANGUAGE_ADDED',
		data: { [langCode]: newLang }
	});

	res.send(result);
}

function langPut(req, res) {
	const data = req.body.data;
	const langCode = req.params.langCode;

	let payload = db.updateLang(langCode, data);
	io.emit('dbEvent', {
		type: 'LANG_UPDATE',
		data: payload
	});

	return {};
}

function tagPost(req) {
	let payload = db.addTag(req.body.tag);
	io.emit('dbEvent', { type: 'TAG_ADDED', data: payload });
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

// ----- create server app with routing from external file
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// routing
// ----------- lang ---------------------
app.get('/lang', (req, res) => res.send(languages)); //list
app.post('/lang', (req, res) => {
	apiFunction(req, res, langPost, false); // fix all this asynchronous stuff with params
});

//------------ lang / :LANGCODE ------------------
app.put('/lang/:langCode', (req, res) => {
	apiFunction(req, res, langPut);
});

//------------tag ----------------------
app.post('/tag', (req, res) => {
	apiFunction(req, res, tagPost);
});

//-----------extra features -----------
app.get('/extra/emptytags', (req, res) => {
	apiFunction(req, res, () => {
		return { data: db.getEmptyTags() };
	});
});

// return info about incoherente tags
app.get('/extra/coherence', (req, res) => {
	apiFunction(req, res, () => {
		return { data: db.checkCoherence() };
	});
});

// ---------- server home page --------------
app.get('/', (req, res) => {
	res.send({ response: 'Translation Server' }).status(200);
});

//START
db.init(config);

//create server and wire up socket.io
const server = http.createServer(app);
const io = socketIo(server);

// configure SOCKET.IO
io.on('connection', socket => {
	console.log('New client connected');
	socket.on('disconnect', () => console.log('Client disconnected'));

	socket.emit('InitialData', { languages: db.getLangs() });
});

// start listenign on server
server.listen(config.port, () =>
	console.log('Translation server is listening on port ' + config.port)
);
