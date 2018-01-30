import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
class App extends Component {
	constructor() {
		super();
		this.state = {
			endpoint: 'http://127.0.0.1:3001' // to get from config, do not keep it in state!!!!
		};
	}
	componentDidMount() {
		const { endpoint } = this.state;
		const socket = socketIOClient(endpoint, {
			// todo correctly here just testing socket with jwt
			query:
				'token=' +
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiSm9obiIsImxhc3RfbmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UuY29tIiwiaWQiOjEyMywiaWF0IjoxNTE3MzEwMzE1LCJleHAiOjE1MTczMTM5MTV9.gJ6XDKFU2h4sx3G9J7IGf1o3cq0Bv9B6imJzEbheoYE'
		});
		socket.on('InitialData', data => console.log('initial', data));
		socket.on('dbEvent', data => console.log('event', data));
	}

	componentWillUnmount() {
		//todo disconnect socket is it necessary?
	}

	render() {
		const { response } = this.state;
		return <div>Should be on.connectEvent on backend</div>;
	}
}
export default App;
