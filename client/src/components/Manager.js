import './Modal.css';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AddForm from './AddForm';
import { CLOSE_FORM } from '../actions/form';
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
		this.hideModal = this.hideModal.bind(this);
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

	hideModal() {
		this.props.dispatch({ type: CLOSE_FORM });
	}

	notificationEmmiter(action) {
		const not = Notification.getDbEventNotification(action);
		this.props.dispatch(propagateDbEvent(not));
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
		const { token, data, modal } = this.props;
		const languages = Object.keys(data).sort();

		return token ? (
			<div className="manager">
				<Navigation />
				<Modal isOpen={modal.show}>
					<ModalHeader toggle={this.hideModal}>
						Create New {modal.type}
					</ModalHeader>
					<ModalBody>
						<AddForm type={modal.type} languages={languages} />
					</ModalBody>
				</Modal>
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
	data: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
	token: PropTypes.string,
	modal: PropTypes.shape({
		show: PropTypes.bool,
		type: PropTypes.string
	})
};

Manager.defaultProps = {
	token: null,
	data: {},
	modal: null
};

const mapStateToProps = state => ({
	token: state.app.token,
	data: state.data.langData,
	modal: state.form
});

export default connect(mapStateToProps)(Manager);
