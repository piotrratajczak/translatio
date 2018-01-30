import './Login.css';

import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { logUser } from '../actionCreators/app';

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null
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
		this.props.dispatch(logUser({ email, password }, this.props.history));

		event.preventDefault();
	};

	render() {
		const { email, password, error } = this.state;

		const isInvalid = password === '' || email === '';
		return (
			<Container>
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
					{error && <p className="errors">{error.message}</p>}
				</form>
			</Container>
		);
	}
}

export default connect()(Login);
