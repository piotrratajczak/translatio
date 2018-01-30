const JSONdb = require('simple-json-db');
const config = require('./config.js');
const helpers = require('./helpers');
const _ = require('lodash');
const fs = require('fs');

let dbs = {};
let languages = [];

function addDbPointer(file) {
	let db = new JSONdb(file, { syncOnWrite: true });
	let langCode = helpers.fileNameToCode(file, config.filesUrl);

	dbs[langCode] = db;
	languages.push(langCode);
}

function init() {
	helpers
		.recFindByExt(config.filesUrl, 'json')
		.forEach(langFile => addDbPointer(langFile, config));
}

function checkCoherence() {
	let keys = getAllTags();

	let reducedKeys = keys.reduce(helpers.keysReduce);

	const length = languages.length;

	return _.chain(reducedKeys)
		.pickBy(amount => amount !== length)
		.keys();
}

function getEmptyTags() {
	let result = {};
	languages.forEach(lang => {
		let empties = _.pickBy(dbs[lang].JSON(), tag => !tag.length);
		if (Object.keys(empties).length) {
			result[lang] = empties;
		}
	});
	return result;
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

function addTag(params) {
	let tag = params.tag;

	if (!tag) {
		throw new Error('Na tag value found!');
	}

	if (tagExist(tag)) {
		throw new Error('Already exists!');
	}

	let payload = {};
	let text;
	languages.forEach(lang => {
		text = params[lang] ? params[lang] : '';
		dbs[lang].set(tag, text);
		payload[lang] = { [tag]: text };
	});
	return payload;
}

function getAllTags(unique = false) {
	let keys = [];

	languages.forEach(lang => {
		keys = [...keys, ...Object.keys(dbs[lang].JSON())];
	});

	return unique ? _.uniq(keys) : keys;
}

function langExist(lang) {
	return languages.indexOf(lang) > -1 || dbs[lang];
}

function addLang(lang) {
	if (!lang) {
		throw new Error('No value found!');
	}

	if (langExist(lang)) {
		throw new Error('Already exists!');
	}

	let newLang = {};
	let tags = getAllTags(true);
	tags.forEach(tag => (newLang[tag] = ''));

	const fileName = config.filesUrl + '/' + lang + '.json';

	fs.writeFileSync(fileName, JSON.stringify(newLang));

	addDbPointer(fileName);

	return { [lang]: newLang };
}

function updateLang(lang, data) {
	if (!langExist(lang)) {
		throw new Error('There is no such a language!');
	}
	let payload = { [lang]: {} };

	Object.keys(data).forEach(tag => {
		let oldValue = dbs[lang].get(tag);
		let newValue = data[tag];
		if (oldValue !== newValue) {
			dbs[lang].set(tag, data[tag]);
			payload[lang][tag] = { newValue: newValue, oldValue: oldValue };
		}
	});
	return payload;
}

module.exports = {
	init: init,
	getDbs: () => dbs,
	getLangs: () => languages,
	checkCoherence: checkCoherence,
	addTag: addTag,
	getEmptyTags: getEmptyTags,
	addLang: addLang,
	updateLang: updateLang
};
