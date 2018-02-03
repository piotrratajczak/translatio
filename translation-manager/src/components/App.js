import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { SET_TOKEN } from '../actions/app';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from './Loader';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import NoMatchPage from './NoMatch';
import Login from './Login';
import Manager from './Manager';
import Auth from '../modules/Auth';

class App extends Component {
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
	token: null,
};

function mapStateToProps(state) {
	return {
		initialized: state.app.initialized,
		token: state.app.token,
	};
}

export default connect(mapStateToProps)(App);
