import { LANG_UPDATED, INITIAL_LANGUAGE_SET } from '../actions/data';
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
import TagForm from './TagForm';
import LangForm from './LangForm';
import StartPage from './StartPage';

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

	handleSave(langCode, data) {
		this.state.socketConnection.emit('clientEvent', {
			type: LANG_UPDATED,
			payload: { langCode, data }
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
			const socket = socketIOClient('http://127.0.0.1:3001', {
				// todo settings
				query: `token=${props.token}`
			});
			socket.on('InitialData', data => {
				this.props.dispatch(propagateDbEvent(data));
			});
			socket.on('dbEvent', data => {
				console.log('event', data);
				this.props.dispatch(propagateDbEvent(data));
			});
			``;
			this.setState({ socketConnection: socket });
		}

		if (this.state.socketConnection && !props.token) {
			this.state.socketConnection.disconnect();
			this.setState({ socketConnection: null });
		}
	}

	render() {
		const { token, data } = this.props;
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
				{langCode && !data[langCode] && <Loader />}
				<Route exact path="/" component={StartPage} />
				<Route
					exact
					path="/add/tag"
					component={() => <TagForm onSubmit={this.handleFormSubmit} />}
				/>
				<Route
					exact
					path="/add/lang"
					component={() => (
						<LangForm languages={languages} onSubmit={this.handleFormSubmit} />
					)}
				/>
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
