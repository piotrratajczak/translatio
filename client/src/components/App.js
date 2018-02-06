import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Auth from '../modules/Auth';
import { Container } from 'reactstrap';
import Loader from './Loader';
import Login from './Login';
import Manager from './Manager';
import NoMatchPage from './NoMatch';
import Notifications from './Notifications';
import { PropTypes } from 'prop-types';
import { SET_TOKEN } from '../actions/app';
import { connect } from 'react-redux';

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
		const { initialized } = this.props;
		return (
			<Router>
				<Container>
					<Notifications />
					{!initialized && <Loader />}
					{initialized && (
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

App.propTypes = {
	initialized: PropTypes.bool, //eslint-disable-line
	dispatch: PropTypes.func.isRequired
};

App.defaultProps = {
	initialized: false
};

function mapStateToProps(state) {
	return {
		initialized: state.app.initialized
		// token: state.app.token
	};
}

export default connect(mapStateToProps)(App);
