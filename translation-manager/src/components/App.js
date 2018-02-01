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

class App extends Component {
	constructor() {
		super();
	}

	componentWillMount() {
		this.getAndSetToken();
	}

	getAndSetToken() {
		let payload = null;
		const token = Auth.getToken();
		if (token) {
			payload = Auth.checkTokenValidity(token) ? token : null;
		}
		this.props.dispatch({ type: SET_TOKEN, payload });
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
							<Route path="/add/" component={Manager} />
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
