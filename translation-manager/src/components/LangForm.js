import React, { Component } from 'react';
import './LangForm.css';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
	Col
} from 'reactstrap';

class LangForm extends Component {
	constructor() {
		super();

		this.state = {
			langCode: '',
			error: null
		};

		this.handlechange = this.handlechange.bind(this);
	}

	handlechange({ target }) {
		const { value } = target;
		let error = this.validateLangCode(value);
		this.setState({ langCode: value, error });
	}

	validateLangCode(langCode) {
		let error = null;
		if (!langCode || langCode.length < 2) {
			error = 'has to have at least 2 characters';
		} else if (this.props.languages.indexOf(langCode) > -1) {
			error = 'already exists!';
		} else if (!/^[a-z/-]+$/.test(langCode)) {
			error = 'may only contains lower characters [a-z] and "-" char';
		} else if (langCode.length > 10) {
			error = 'cannot be longer than 10 chars';
		}
		return error;
	}

	render() {
		return (
			<Form className="p-3" onSubmit={this.props.onSubmit}>
				<FormGroup row>
					<Label for="exampleEmail" xs={12} sm={2}>
						LangCode:
					</Label>
					<Col xs={12} sm={7}>
						<Input
							onChange={this.handlechange}
							value={this.state.langCode}
							type="text"
							name="langCode"
							id="langCode"
							placeholder="LangCode"
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

export default LangForm;
