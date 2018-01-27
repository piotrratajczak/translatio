const JSONdb = require('simple-json-db');
const helpers = require('./helpers');
const _ = require('lodash');

let dbs = {};
let languages = [];

function addDbPointer(file, config) {
	let db = new JSONdb(file, { syncOnWrite: true });
	let langCode = helpers.fileNameToCode(file, config.filesUrl);

	dbs[langCode] = db;
	languages.push(langCode);
}

function init(config) {
	helpers
		.recFindByExt(config.filesUrl, 'json')
		.forEach(langFile => addDbPointer(langFile, config));
}

function checkCoherence() {
	let keys = [];

	languages.forEach(lang => {
		keys = [...keys, ...Object.keys(dbs[lang].JSON())];
	});

	let reducedKeys = keys.reduce(helpers.keysReduce);

	const length = languages.length;

	return _.chain(reducedKeys)
		.pickBy(amount => amount !== length)
		.keys();
}

function tagExist(tag) {
	let exists = false;
	for (let i = 0; i < languages.length; i++) {
		if (dbs[languages[i]].has(tag)) {
			exists = true;
			break;
		}
	}
	return exists;
}

function addTag(tag) {
	if (!tag) {
		throw new Error('Na tag value found!');
	}

	if (tagExist(tag)) {
		throw new Error('Already exists!');
	}

	let payload = {};
	languages.forEach(lang => {
		dbs[lang].set(tag, '');
		payload[lang] = { [tag]: '' };
	});
	return payload;
}

module.exports = {
	init: init,
	getDbs: () => dbs,
	getLangs: () => languages,
	checkCoherence: checkCoherence,
	addTag: addTag
};
