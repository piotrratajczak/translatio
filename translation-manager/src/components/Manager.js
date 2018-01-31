import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import { logoutUser } from '../actionCreators/app';

class Manager extends Component {
	constructor() {
		super();

		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		this.props.dispatch(logoutUser());
	}

	render() {
		const { token, languages } = this.props;
		return token ? (
			<div>
				<Navigation onLogoutClick={this.handleLogout} languages={languages} />
				todo manager - what the fifi
			</div>
		) : (
			<Redirect to="/login" />
		);
	}
}

const mapStateToProps = state => ({
	token: state.app.token,
	languages: state.data.languages
});

export default connect(mapStateToProps)(Manager);
