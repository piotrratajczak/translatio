import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Manager = props =>
	props.token ? (
		<div> todo manager {props.token} - what the fifi</div>
	) : (
		<Redirect to="/login" />
	);

const mapStateToProps = state => ({
	token: state.app.token
});

export default connect(mapStateToProps)(Manager);
