const JSONdb = require('simple-json-db');
const helpers = require('./helpers');

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

module.exports = {
	getDbs: () => dbs,
	getLangs: () => languages,
	init: init
};
