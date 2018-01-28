const config = require('./config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const helpers = require('./helpers');
const db = require('./db');

//TODO make global config file!!!!

// ----- create server app with routing from external file
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// import and inject routing
app.use(require('./routes.js'));

//inject socket emit on db changes by api
app.use(function(req, res, next) {
	if (res.locals.toEmit) {
		io.emit('dbEvent', res.locals.toEmit);
	}
	next();
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
