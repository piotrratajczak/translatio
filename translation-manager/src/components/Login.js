import './Login.css';

import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { loginUser } from '../actionCreators/app';
import Loader from './Loader';

const INITIAL_STATE = {
	email: '',
	password: ''
};

const byPropKey = (propertyName, value) => () => ({
	[propertyName]: value
});

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		let { email, password } = this.state;
		this.props.dispatch(loginUser({ email, password }, this.props.history));
		event.preventDefault();
	};

	render() {
		const { email, password } = this.state;
		const { status } = this.props;

		const isInvalid = password === '' || email === '';
		return (
			<Container>
				{status === 'pending' && <Loader />}
				{status !== 'pending' && (
					<form className="form-signin" onSubmit={this.onSubmit}>
						<h2 className="form-signin-heading">Please sign in</h2>
						<label htmlFor="inputEmail" className="sr-only">
							Email address
						</label>
						<input
							type="email"
							id="inputEmail"
							className="form-control"
							placeholder="Email address"
							value={email}
							onChange={event =>
								this.setState(byPropKey('email', event.target.value))
							}
							required
							autoFocus
						/>
						<label htmlFor="inputPassword" className="sr-only">
							Password
						</label>
						<input
							type="password"
							id="inputPassword"
							className="form-control"
							placeholder="Password"
							value={password}
							onChange={event =>
								this.setState(byPropKey('password', event.target.value))
							}
							required
						/>

						<button
							className="btn btn-lg btn-primary btn-block"
							type="submit"
							disabled={isInvalid}>
							Sign in
						</button>
						<p className="errors">{status}</p>
					</form>
				)}
			</Container>
		);
	}
}

Login.defaultProps = {
	status: null
};

function mapStateToProps(state) {
	return {
		status: state.app.loginStatus
	};
}

export default connect(mapStateToProps)(Login);