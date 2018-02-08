import './Modal.css';
import { LANG_DELETED, LANG_UPDATED, TAG_DELETED } from '../actions/data';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import React, { Component } from 'react';
import AddForm from './AddForm';
import LangPage from './LangPage';
import Loader from './Loader';
import Navigation from './Navigation';
import Notification from '../modules/Notification';
import { PropTypes } from 'prop-types';
import { Redirect } from 'react-router-dom';
import StartPage from './StartPage';
import { connect } from 'react-redux';
import { logoutUser } from '../actionCreators/app';
import propagateDbEvent from '../actionCreators/data';
import socketIOClient from 'socket.io-client';

class Manager extends Component {
	constructor() {
		super();

		this.state = {
			socketConnection: null,
			modal: null
		};

		this.handleLogout = this.handleLogout.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleTagDelete = this.handleTagDelete.bind(this);
		this.handleLangDelete = this.handleLangDelete.bind(this);
		this.checkSocketConnection = this.checkSocketConnection.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
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

	showModal(type) {
		this.setState({ modal: type });
	}

	hideModal() {
		this.setState({ modal: null });
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

	handleTagDelete(tag) {
		this.state.socketConnection.emit('clientEvent', {
			type: TAG_DELETED,
			payload: { tag }
		});
	}

	handleLangDelete(langCode) {
		this.state.socketConnection.emit('clientEvent', {
			type: LANG_DELETED,
			payload: { langCode }
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
				this.props.dispatch(Notification.getDbEventNotification(data));
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
			<div className="manager">
				<Navigation
					onLogoutClick={this.handleLogout}
					languages={languages}
					onAddClick={this.showModal}
				/>
				<Modal isOpen={this.state.modal !== null}>
					<ModalHeader toggle={this.hideModal}>
						Create New {this.state.modal}
					</ModalHeader>
					<ModalBody>
						<AddForm
							type={this.state.modal}
							languages={languages}
							onSubmit={this.handleFormSubmit}
						/>
					</ModalBody>
				</Modal>
				{langCode &&
					data[langCode] && (
						<LangPage
							data={langData}
							lang={langCode}
							onSave={this.handleSave}
							onDelete={this.handleTagDelete}
							onAddClick={this.showModal}
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
				{!langCode && (
					<StartPage
						languages={languages}
						onDelete={this.handleLangDelete}
						onAddClick={this.showModal}
					/>
				)}
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
