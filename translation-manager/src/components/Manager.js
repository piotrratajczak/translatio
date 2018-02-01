import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET
} from '../actions/data';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import { logoutUser } from '../actionCreators/app';
import { updateLanguage } from '../actionCreators/data';
import LangPage from './LangPage';
import { Route } from 'react-router-dom';
import Loader from './Loader';
import socketIOClient from 'socket.io-client';
import { propagateDbEvent } from '../actionCreators/data';

class Manager extends Component {
	constructor() {
		super();

		this.state = {
			socketConnection: null
		};

		this.handleLogout = this.handleLogout.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.checkSocketConnection = this.checkSocketConnection.bind(this);
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

	handleSave(langCode, data) {
		this.state.socketConnection.emit('clientEvent', {
			type: LANG_UPDATED,
			payload: { langCode, data }
		});
	}

	checkSocketConnection(props) {
		if (!this.state.socketConnection && props.token) {
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
		const { token, data } = this.props;
		const languages = Object.keys(data);
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
				{langCode && !data[langCode] && <Loader />}
				{!langCode && <div> todo start page </div>}
			</div>
		) : (
			<Redirect to="/login" />
		);
	}
}

const mapStateToProps = state => ({
	token: state.app.token,
	data: state.data.langData,
	dataAction: state.data.action
});

export default connect(mapStateToProps)(Manager);
