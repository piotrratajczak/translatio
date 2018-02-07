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

function regexCheck(value) {
	if (!/^[a-z/-]+$/.test(value)) {
		throw new Error('Contains some prohibited characters!');
	}
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

	if (!languages.length) {
		throw new Error(
			'There is no language! Cannot add tag to null! Please create any language first!'
		);
	}

	regexCheck(tag);

	let payload = {};
	let text;
	languages.forEach(lang => {
		text = params[lang] ? params[lang] : '';
		dbs[lang].set(tag, text);
		payload[lang] = { [tag]: text };
	});
	return payload;
}

function deleteTag(params) {
	let tag = params.tag;

	if (!tag) {
		throw new Error('Na tag value found!');
	}

	if (!tagExist(tag)) {
		throw new Error('Nothing to delete!');
	}

	regexCheck(tag);

	languages.forEach(lang => {
		dbs[lang].delete(tag);
	});

	return { tag };
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

function addLang({ langCode }) {
	if (!langCode) {
		throw new Error('No value found!');
	}

	if (langExist(langCode)) {
		throw new Error('Already exists!');
	}

	regexCheck(langCode);

	let newLang = {};
	let tags = getAllTags(true);
	tags.forEach(tag => (newLang[tag] = ''));

	const fileName = config.filesUrl + '/' + langCode + '.json';
	fs.writeFileSync(fileName, JSON.stringify(newLang));

	addDbPointer(fileName);

	return { [langCode]: newLang };
}

function updateLang({ langCode, data }) {
	if (!langExist(langCode)) {
		throw new Error('There is no such a language!');
	}
	let payload = { langCode: langCode, tags: {} };

	Object.keys(data).forEach(tag => {
		let oldValue = dbs[langCode].get(tag);
		let newValue = data[tag];
		if (oldValue !== newValue) {
			dbs[langCode].set(tag, data[tag]);
			payload.tags[tag] = newValue;
		}
	});

	if (!Object.keys(payload.tags).length) {
		payload = null;
	}

	return payload;
}

function checkUser(email, password) {
	const profile = {
		first_name: 'Admin',
		last_name: 'Admin',
		email: 'admin@admin.pl',
		password: 'admin'
	};
	if (email === profile.email && password === profile.password) {
		return { email: profile.email, name: profile.first_name };
	} else {
		return null;
	}
}

function getAllData() {
	let result = {};
	languages.forEach(lang => {
		result[lang] = dbs[lang].JSON();
	});
	return result;
}

module.exports = {
	init: init,
	getDbs: () => dbs,
	getLangs: () => languages,
	checkCoherence: checkCoherence,
	addTag: addTag,
	deleteTag: deleteTag,
	getEmptyTags: getEmptyTags,
	addLang: addLang,
	updateLang: updateLang,
	checkUser: checkUser,
	getAllData: getAllData,
	langExist: langExist
};
