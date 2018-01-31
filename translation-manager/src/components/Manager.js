import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import { logoutUser } from '../actionCreators/app';
import LangPage from './LangPage';
import { Route } from 'react-router-dom';
import Loader from './Loader';

class Manager extends Component {
	constructor() {
		super();

		this.handleLogout = this.handleLogout.bind(this);
	}

	componentWillMount() {
		this.checkLangData();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.langCode !== this.props.match.params.langCode) {
			this.checkLangData(nextProps);
		}
	}

	checkLangData(props = this.props) {
		const { langCode } = props.match.params;
		if (!props.data[langCode] && !props.dataAction) {
			console.log('We have to load this data!!!!', langCode);
		}
	}

	handleLogout() {
		this.props.dispatch(logoutUser());
	}

	render() {
		const { token, data } = this.props;
		const languages = Object.keys(data);
		const { langCode } = this.props.match.params;
		const langData = data[langCode];

		return token ? (
			<div>
				<Navigation onLogoutClick={this.handleLogout} languages={languages} />
				{data[langCode] && (
					<Route
						path={`/lang/:langCode`}
						component={() => <LangPage data={langData} />}
					/>
				)}
				{!data[langCode] && <Loader />}
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
