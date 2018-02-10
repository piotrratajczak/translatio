import socketIOClient from 'socket.io-client';

let socket = null;
// const actions = ['InitialData', 'dbEvent', 'responseStatus'];

class Socket {
	static setConnetion(token) {
		socket = socketIOClient('', {
			query: `token=${token}`
		});

		return true;
	}

	static subscribe(action, callBack) {
		socket.on(action, callBack);
	}

	static disconnect() {
		socket.disconnect();
	}

	static emitClientEvent(event) {
		socket.emit('clientEvent', event);
	}

	// todo wszystkie inne funkcje które bedę wywoływał dla clientEvent
}

export default Socket;
