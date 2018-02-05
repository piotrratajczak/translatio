import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AddForm from './AddForm';
import { LANG_UPDATED } from '../actions/data';
import LangPage from './LangPage';
import Loader from './Loader';
import Navigation from './Navigation';
import { PropTypes } from 'prop-types';
import StartPage from './StartPage';
import { connect } from 'react-redux';
import { logoutUser } from '../actionCreators/app';
import propagateDbEvent from '../actionCreators/data';
import socketIOClient from 'socket.io-client';

class Manager extends Component {
	constructor() {
		super();

		this.state = {
			socketConnection: null
		};

		this.handleLogout = this.handleLogout.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.checkSocketConnection = this.checkSocketConnection.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
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

	handleLogout() {
		this.props.dispatch(logoutUser());
	}

	handleSave(data) {
		this.state.socketConnection.emit('clientEvent', {
			type: LANG_UPDATED,
			payload: { langCode: this.props.match.params.langCode, data }
		});
	}

	handleFormSubmit({ type, payload }) {
		this.state.socketConnection.emit('clientEvent', {
			type,
			payload
		});
	}

	checkSocketConnection(props) {
		if (!this.state.socketConnection && props.token) {
			const socket = socketIOClient('', {
				query: `token=${props.token}`
			});
			socket.on('InitialData', data => {
				this.props.dispatch(propagateDbEvent(data));
			});
			socket.on('dbEvent', data => {
				this.props.dispatch(propagateDbEvent(data));
			});

			socket.on('responseStatus', data => {
				// eslint-disable-next-line
				console.log('responseStatus:', data, 'to be used for notifications');
			});
			this.setState({ socketConnection: socket });
		}

		if (this.state.socketConnection && !props.token) {
			this.state.socketConnection.disconnect();
			this.setState({ socketConnection: null });
		}
	}

	render() {
		const { token, data, initialized } = this.props;
		const languages = Object.keys(data).sort();
		const { langCode } = this.props.match.params;
		const langData = data[langCode];

		return token ? (
			<div>
				<Navigation onLogoutClick={this.handleLogout} languages={languages} />
				{langCode &&
					data[langCode] && (
						<LangPage
							data={langData}
							lang={langCode}
							onSave={this.handleSave}
						/>
					)}
				{langCode && !data[langCode] && !initialized && <Loader />}
				{langCode &&
					!data[langCode] &&
					initialized && (
						<p className="text-center">
							Are you sure there should be such a language avaible?
						</p>
					)}
				<Route
					exact
					path="/"
					component={() => <StartPage languages={languages} />}
				/>
				<Route
					exact
					path="/add/tag"
					component={() => (
						<AddForm type="tag" onSubmit={this.handleFormSubmit} />
					)}
				/>
				<Route
					exact
					path="/add/lang"
					component={() => (
						<AddForm
							type="langCode"
							languages={languages}
							onSubmit={this.handleFormSubmit}
						/>
					)}
				/>
			</div>
		) : (
			<Redirect to="/login" />
		);
	}
}

Manager.propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired, //eslint-disable-line
	data: PropTypes.object, //eslint-disable-line
	token: PropTypes.string,
	initialized: PropTypes.bool
};

Manager.defaultProps = {
	token: null,
	data: {},
	initialized: false
};

const mapStateToProps = state => ({
	token: state.app.token,
	data: state.data.langData,
	initialized: state.data.initialized
});

export default connect(mapStateToProps)(Manager);
