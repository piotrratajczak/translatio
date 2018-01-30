const config = require('./config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const socketioJwt = require('socketio-jwt');
const helpers = require('./helpers');
const db = require('./db');

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
	console.log(
		socket.client.request.decoded_token.email,
		'connected',
		new Date()
	);

	socket.on('disconnect', () => console.log('Client disconnected'));

	socket.emit('InitialData', { languages: db.getLangs() });
});

// start listenign on server
server.listen(config.port, () =>
	console.log('Translation server is listening on port ' + config.port)
);
