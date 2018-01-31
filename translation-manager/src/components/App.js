import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { SET_TOKEN } from '../actions/app';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import Loader from './Loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import NoMatchPage from './NoMatch';
import Login from './Login';
import Manager from './Manager';
import Auth from '../modules/Auth';
import { propagateDbEvent } from '../actionCreators/data';

class App extends Component {
	constructor() {
		super();
		this.state = {
			socketConnection: null
		};

		this.checkSocketConnection = this.checkSocketConnection.bind(this);
	}

	componentWillMount() {
		this.getAndSetToken();
	}

	componentDidMount() {
		this.checkSocketConnection(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.checkSocketConnection(nextProps);
	}

	componentWillUnmount() {
		if (this.state.socketConnection) {
			this.state.socketConnection.disconnect();
		}
	}

	getAndSetToken() {
		let payload = null;
		const token = Auth.getToken();
		if (token) {
			payload = Auth.checkTokenValidity(token) ? token : null;
		}
		this.props.dispatch({ type: SET_TOKEN, payload });
	}

	checkSocketConnection(props) {
		if (!this.state.socketConnection && props.initialized && props.token) {
			const socket = socketIOClient('http://127.0.0.1:3001', {
				// todo correctly here just testing socket with jwt
				query: `token=${props.token}`
			});
			socket.on('InitialData', data => {
				this.props.dispatch(propagateDbEvent(data));
			});
			socket.on('dbEvent', data => {
				console.log('event', data);
				this.props.dispatch(propagateDbEvent(data));
			});

			socket.emit('clientEvent', { hello: 'world' }); // TODO really emit event instead of api

			this.setState({ socketConnection: socket });
		}

		if (this.state.socketConnection && !props.token) {
			this.state.socketConnection.disconnect();
			this.setState({ socketConnection: null });
		}
	}

	render() {
		const { props } = this;
		return (
			<Router>
				<Container>
					{!props.initialized && <Loader />}
					{props.initialized && (
						<Switch>
							<Route exact path="/login" component={Login} />
							<Route exact path="/" component={Manager} />
							<Route exact path="/lang/:langCode" component={Manager} />
							<Route component={NoMatchPage} />
						</Switch>
					)}
				</Container>
			</Router>
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
