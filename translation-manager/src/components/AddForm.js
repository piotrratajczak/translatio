import './AddForm.css';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { LANG_ADDED, TAG_ADDED } from '../actions/data';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

const INITIAL_STATE = { value: '', error: null };

const langCodeValidation = (langCode, languages) => {
	let error = null;
	if (!langCode || langCode.length < 2) {
		error = 'has to have at least 2 characters';
	} else if (languages.indexOf(langCode) > -1) {
		error = 'already exists!';
	} else if (!/^[a-z/-]+$/.test(langCode)) {
		error = 'may only contains lower characters [a-z] and "-" char';
	} else if (langCode.length > 10) {
		error = 'cannot be longer than 10 chars';
	}
	return error;
};

const tagValidation = tag => {
	let error = null;
	if (!tag || tag.length < 2) {
		error = 'has to have at least 2 characters';
	} else if (!/^[A-z0-9/-]+$/.test(tag)) {
		error = 'may only contains lower characters [a-z] and "-" char';
	} else if (tag.length > 50) {
		error = 'cannot be longer than 50 chars';
	}
	return error;
};

class AddForm extends Component {
	constructor() {
		super();

		this.state = {
			...INITIAL_STATE
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange({ target }) {
		const { value } = target;
		const error = this.validateValue(value);
		this.setState({ value, error });
	}

	validateValue(value) {
		return this.props.type === 'tag'
			? tagValidation(value)
			: langCodeValidation(value, this.props.languages);
	}

	handleSubmit(evt) {
		this.props.onSubmit({
			payload: { [this.props.type]: evt.target.elements.value.value },
			type: this.props.type === 'tag' ? TAG_ADDED : LANG_ADDED
		});
		this.setState(() => INITIAL_STATE);
		evt.preventDefault();
	}

	render() {
		return (
			<Form className="p-3" onSubmit={this.handleSubmit}>
				<FormGroup row>
					<Label htmlFor="value" xs={12} sm={2}>
						{this.props.type}:
					</Label>
					<Col xs={12} sm={7}>
						<Input
							onChange={this.handleChange}
							value={this.state.value}
							type="text"
							name="value"
							id="value"
							placeholder={this.props.type}
						/>
					</Col>
					<Col xs={12} className="hidden-sm-up errors">
						{this.state.error}
					</Col>
					<Col xs={12} sm={3}>
						<Button
							className="w-100"
							type="submit"
							disabled={this.state.error !== null}>
							Submit
						</Button>
					</Col>
					<Col className="hidden-xs-down errors" xs={12}>
						{this.state.error}
					</Col>
				</FormGroup>
			</Form>
		);
	}
}

AddForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	languages: PropTypes.arrayOf(PropTypes.string)
};

AddForm.defaultProps = {
	languages: []
};

export default AddForm;
