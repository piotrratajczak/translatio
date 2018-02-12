import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AddModal from './AddModal';
import LangPage from './LangPage';
import Navigation from './Navigation';
import Notification from '../modules/Notification';
import { PropTypes } from 'prop-types';
import Socket from '../modules/Socket';
import StartPage from './StartPage';
import { connect } from 'react-redux';
import propagateDbEvent from '../actionCreators/data';

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

	handleNotificationEmission(action) {
		const not = Notification.getDbEventNotification(action);
		this.handleEventEmission(not);
	}

	handleEventEmission(data) {
		this.props.dispatch(propagateDbEvent(data));
	}

	handleSocketConnection(props) {
		if (!this.state.socketConnection && props.token) {
			const socket = Socket.setConnetion(props.token);
			Socket.subscribe('InitialData', this.handleEventEmission);
			Socket.subscribe('dbEvent', this.handleEventEmission);
			Socket.subscribe('responseStatus', this.handleNotificationEmission);
			this.setState({ socketConnection: socket });
		}

		if (this.state.socketConnection && !props.token) {
			Socket.disconnect();
			this.setState({ socketConnection: null });
		}
	}

	render() {
		const { token } = this.props;
		return token ? (
			<div className="manager">
				<Navigation />
				<AddModal />
				<Route exact path="/" component={StartPage} />
				<Route exact path="/lang/:langCode" component={LangPage} />
			</div>
		) : (
			<Redirect to="/login" />
		);
	}
}

Manager.propTypes = {
	dispatch: PropTypes.func.isRequired,
	token: PropTypes.string
};

Manager.defaultProps = {
	token: null
};

const mapStateToProps = state => ({
	token: state.app.token
});

export default connect(mapStateToProps)(Manager);
