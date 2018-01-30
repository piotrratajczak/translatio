import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			socketConnection: null
		};

		this.createSocketConnection = this.createSocketConnection.bind(this);
	}

	componentWillMount() {
		let token = localStorage.getItem('token');
		this.props.dispatch({ type: 'SET_TOKEN', payload: token });
	}

	componentDidMount() {
		this.createSocketConnection(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createSocketConnection(nextProps);
	}

	componentWillUnmount() {
		//todo disconnect socket is it necessary?
	}

	createSocketConnection(props) {
		console.log(!this.state.socketConnection, props.initialized, props.token);
		if (!this.state.socketConnection && props.initialized && props.token) {
			const socket = socketIOClient('http://127.0.0.1:3001', {
				// todo correctly here just testing socket with jwt
				query: `token=${props.token}`
			});
			socket.on('InitialData', data => console.log('initial', data));
			socket.on('dbEvent', data => console.log('event', data));
			this.setState({ socketConnection: socket });
		}
	}

	render() {
		const { props } = this;
		return (
			<div>
				{!props.initialized && <Loader />}
				{props.initialized &&
					props.token && <div>Initialized and with token</div>}
				{props.initialized &&
					!props.token && <div> todo redirect to login </div>}
			</div>
		);
	}
}

App.defaultProps = {
	initialized: false,
	token: null
};

function mapStateToProps(state) {
	return {
		initialized: state.app.initialized,
		token: state.app.token
	};
}

export default connect(mapStateToProps)(App);
