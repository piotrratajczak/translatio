const fs = require('fs');
const path = require('path');

function recFindByExt(base, ext, files, result) {
	files = files || fs.readdirSync(base);
	result = result || [];

	files.forEach(function(file) {
		var newbase = path.join(base, file);
		if (fs.statSync(newbase).isDirectory()) {
			result = recFindByExt(newbase, ext, fs.readdirSync(newbase), result);
		} else {
			if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
				result.push(newbase);
			}
		}
	});
	return result;
}

function fileNameToCode(file, configPath) {
	let to = file.indexOf('.json'),
		from = configPath.length + 1;
	return file.substr(from, to - from);
}

function keysReduce(prev, cur, index) {
	// initial action for 0  - it starts with second element as cur (index === 1)
	if (index === 1) {
		let a = {};
		a[prev] = 1;
		prev = a;
	}
	// normal action for all elements
	if (prev[cur]) {
		prev[cur]++;
	} else {
		prev[cur] = 1;
	}

	return prev;
}

module.exports = {
	recFindByExt: recFindByExt,
	fileNameToCode: fileNameToCode,
	keysReduce: keysReduce
};
