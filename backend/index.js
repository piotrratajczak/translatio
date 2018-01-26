const config = require('./config.js');
const _ = require('lodash');
const fs = require('fs');
const express = require('express');
const JSONdb = require('simple-json-db');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const helpers = require('./helpers');
let languages = [], //avaible languages list
	dbs = {}; // db pointers

// makes db pointers and languageCode
function addDbPointer(file) {
	let db = new JSONdb(file, {
		syncOnWrite: true
	});
	let langCode = helpers.fileNameToCode(file, config.filesUrl);

	dbs[langCode] = db;
	languages.push(langCode);
}

function langPost(req, res) {
	let result = { error: null, success: true };
	const langCode = req.body.langCode;
	if (languages.indexOf(langCode) > -1 || dbs[langCode]) {
		throw new Error('Already exists!');
	} else {
		let newLang = {};

		// if there already exist any data copy it with empty values
		let existingLangs = Object.keys(dbs);
		if (existingLangs.length) {
			//todo map values all - also incoherent, distinct
			newLang = _.mapValues(dbs[existingLangs[0]].JSON(), () => '');
		}

		const fileName = config.filesUrl + '/' + langCode + '.json';

		fs.writeFile(fileName, JSON.stringify(newLang), function(err) {
			if (err) {
				throw new Error('Could not createa a db file!');
			}

			addDbPointer(fileName);
		});

		// emit event
		io.emit('dbEvent', {
			type: 'LANGUAGE_ADDED',
			data: { [langCode]: newLang }
		});

		res.send(result);
	}
}

function langPut(req, res) {
	const data = req.body.data;
	const langCode = req.params.langCode;
	if (languages.indexOf(langCode) < 0) {
		throw new Error('Language does not exist!');
	} else {
		Object.keys(data).forEach(tag => {
			let oldValue = dbs[langCode].get(tag);
			let newValue = data[tag];
			if (oldValue !== newValue) {
				dbs[langCode].set(tag, data[tag]);
				io.emit('dbEvent', {
					type: 'TRANSLATION_CHANGED',
					data: {
						[langCode]: { [tag]: { newValue: newValue, oldValue: oldValue } }
					}
				});
			}
		});
	}

	return {};
}

function tagPost(req, res) {
	const tag = req.body.tag;

	if (!tag) {
		throw new Error('Wrong tag!');
	}

	let exists = false;
	languages.forEach(lang => {
		if (dbs[lang].has(tag)) {
			exists = true;
		}
	});

	if (exists) {
		throw new Error('Already exists!');
	} else {
		let payload = {};
		languages.forEach(lang => {
			dbs[lang].set(tag, '');
			payload[lang] = { [tag]: '' };
		});
		io.emit('dbEvent', { type: 'TAG_ADDED', data: payload });
	}

	return {};
}

function getEmptyTags(res, req) {
	let result = { data: {} };
	languages.forEach(lang => {
		let empties = _.pickBy(dbs[lang].JSON(), tag => !tag.length);
		if (Object.keys(empties).length) {
			result.data[lang] = empties;
		}
	});
	return result;
}

function checkCoherence(res, req) {
	let result = { data: {} };
	let keys = [];

	languages.forEach(lang => {
		keys = [...keys, ...Object.keys(dbs[lang].JSON())];
	});

	let reducedKeys = keys.reduce(helpers.keysReduce);

	const length = languages.length;

	result.data = _.chain(reducedKeys)
		.pickBy(amount => amount !== length)
		.keys();

	return result;
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
	apiFunction(req, res, langPost, false);
});

//------------ lang / :LANGCODE ------------------
// app.get('/lang/:langCode', (req, res) => {
// 	let result = { error: null, success: true };
// 	try {
// 		const langCode = req.params.langCode;
// 		if (languages.indexOf(langCode) > -1) {
// 			result.data = dbs[langCode].JSON();
// 		} else {
// 			throw new Error('Does not exist!');
// 		}
// 	} catch (e) {
// 		result.error = e.toString();
// 		result.success = false;
// 	} finally {
// 		res.send(result);
// 	}
// });
app.put('/lang/:langCode', (req, res) => {
	apiFunction(req, res, langPut);
});

//------------tag ----------------------
app.post('/tag', (req, res) => {
	apiFunction(req, res, tagPost);
});

//-----------extra features -----------
app.get('/extra/emptytags', (req, res) => {
	apiFunction(req, res, getEmptyTags);
});

// return info about incoherente tags
app.get('/extra/coherence', (req, res) => {
	apiFunction(req, res, checkCoherence);
});

// ---------- server home page --------------
app.get('/', (req, res) => {
	res.send({ response: 'Translation Server' }).status(200);
});

//START
// get necessary data - db pointers and avaible languages list
helpers
	.recFindByExt(config.filesUrl, 'json')
	.forEach(langFile => addDbPointer(langFile));

//create server and wire up socket.io

const server = http.createServer(app);
const io = socketIo(server);

// configure SOCKET.IO
io.on('connection', socket => {
	console.log('New client connected');
	socket.on('disconnect', () => console.log('Client disconnected'));

	socket.emit('InitialData', { languages: languages });
});

// start listenign on server
server.listen(config.port, () =>
	console.log('Translation server is listening on port ' + config.port)
);
