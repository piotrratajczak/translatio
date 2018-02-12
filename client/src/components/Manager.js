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

		this.checkSocketConnection = this.checkSocketConnection.bind(this);
		this.socketEventEmmiter = this.socketEventEmmiter.bind(this);
		this.notificationEmmiter = this.notificationEmmiter.bind(this);
	}

	componentDidMount() {
		this.checkSocketConnection(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.checkSocketConnection(nextProps);
	}

	componentWillUnmount() {
		if (this.state.socketConnection) {
			Socket.disconnect();
		}
	}

	notificationEmmiter(action) {
		const not = Notification.getDbEventNotification(action);
		this.socketEventEmmiter(not);
	}

	socketEventEmmiter(data) {
		this.props.dispatch(propagateDbEvent(data));
	}

	checkSocketConnection(props) {
		if (!this.state.socketConnection && props.token) {
			const socket = Socket.setConnetion(props.token);
			Socket.subscribe('InitialData', this.socketEventEmmiter);
			Socket.subscribe('dbEvent', this.socketEventEmmiter);
			Socket.subscribe('responseStatus', this.notificationEmmiter);
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
