const config = require('./config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const socketioJwt = require('socketio-jwt');
const helpers = require('./helpers');
const db = require('./db');
const path = require('path');
// ----- create server app with routing from external file
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

// return client - React app
app.use(express.static(path.join(__dirname, 'client/build')));
// import and inject routing
app.use(require('./apiRoutes'));
// catchall
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

//inject socket emit on db changes by api
app.use(function(req, res, next) {
	if (res.locals.toEmit) {
		io.emit('dbEvent', res.locals.toEmit);
	}
	next();
});

//START
db.init();

//create server and wire up socket.io
const server = http.createServer(app);

const io = socketIo.listen(server);

io.set(
	'authorization',
	socketioJwt.authorize({
		secret: config.jwtSecret,
		handshake: true
	})
);

// configure SOCKET.IO
io.on('connection', socket => {
	console.info(
		socket.client.request.decoded_token.email,
		'connected',
		new Date()
	);

	socket.on('clientEvent', data => {
		console.log(data);
		let func = null,
			payload = null;
		switch (data.type) {
			case 'data/SOCKET_LANG_ADDED':
				func = 'addLang';
				break;

			case 'data/SOCKET_LANG_UPDATED':
				func = 'updateLang';
				break;

			case 'data/SOCKET_LANG_DELETED':
				func = 'deleteLang';
				break;

			case 'data/SOCKET_TAG_ADDED':
				func = 'addTag';
				break;

			case 'data/SOCKET_TAG_DELETED':
				func = 'deleteTag';
				break;
		}
		if (func) {
			let response = { error: false, success: true, action: data.type };
			try {
				payload = db[func](data.payload);
			} catch (err) {
				response.error = err.toString();
				response.success = false;
			} finally {
				socket.emit('responseStatus', response);
				if (payload) {
					io.emit('dbEvent', { payload, type: data.type });
				}
			}
		}
	});

	socket.on('disconnect', () => console.info('Client disconnected'));

	socket.emit('InitialData', {
		type: 'data/SOCKET_INITIAL_LANGUAGE_SET',
		payload: db.getAllData() //db.getLangs()
	});
});

// start listenign on server
server.listen(process.env.PORT || config.port, () =>
	console.info('Translation server is listening on port ' + config.port)
);
