import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import ActionHelper from '../modules/ActionHelper';
import AddForm from './AddForm';
import LangPage from './LangPage';
import Navigation from './Navigation';
import { PropTypes } from 'prop-types';
import Socket from '../modules/Socket';
import StartPage from './StartPage';
import { connect } from 'react-redux';

class Manager extends Component {
	constructor() {
		super();

		this.state = {
			socketConnection: null
		};

		Object.getOwnPropertyNames(Manager.prototype)
			.filter(method => method.indexOf('handle') === 0)
			.forEach(method => {
				this[method] = this[method].bind(this);
			});
	}

	componentDidMount() {
		this.handleSocketConnection(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.handleSocketConnection(nextProps);
	}

	componentWillUnmount() {
		if (this.state.socketConnection) {
			Socket.disconnect();
		}
	}

	handleDbResponse(data) {
		const formAction = ActionHelper.getFormAction(data);
		if (formAction) {
			this.props.dispatch(formAction);
		}

		const not = ActionHelper.getDbEventNotification(data);
		this.props.dispatch(not);
	}

	handleSocketConnection({ token, dispatch }) {
		if (!this.state.socketConnection && token) {
			const socket = Socket.setConnetion(token);
			Socket.subscribe('InitialData', dispatch);
			Socket.subscribe('dbEvent', dispatch);
			Socket.subscribe('responseStatus', this.handleDbResponse);
			this.setState({ socketConnection: socket });
		}

		if (this.state.socketConnection && !token) {
			Socket.disconnect();
			this.setState({ socketConnection: null });
		}
	}

	render() {
		const { token, match } = this.props;
		let redirectUrl = '/login';
		if (match.url !== '/') {
			redirectUrl += `?url=${match.url}`;
		}
		return token ? (
			<div className="manager">
				<Navigation />
				<AddForm />
				<Route exact path="/" component={StartPage} />
				<Route exact path="/lang/:langCode" component={LangPage} />
			</div>
		) : (
			<Redirect to={redirectUrl} />
		);
	}
}

Manager.propTypes = {
	dispatch: PropTypes.func.isRequired,
	token: PropTypes.string,
	match: PropTypes.shape({
		params: PropTypes.shape({
			langCode: PropTypes.string
		})
	}).isRequired
};

Manager.defaultProps = {
	token: null
};

const mapStateToProps = state => ({
	token: state.app.token
});

export default connect(mapStateToProps)(Manager);
