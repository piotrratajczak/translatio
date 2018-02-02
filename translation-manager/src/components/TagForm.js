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
import { TAG_ADDED } from '../actions/data';

const INITIAL_STATE = { tag: '', error: null };

class TagForm extends Component {
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
		let error = this.validateTag(value);
		this.setState({ tag: value, error });
	}

	validateTag(tag) {
		let error = null;
		if (!tag || tag.length < 2) {
			error = 'has to have at least 2 characters';
		} else if (!/^[A-z0-9/-]+$/.test(tag)) {
			error = 'may only contains lower characters [a-z] and "-" char';
		} else if (tag.length > 50) {
			error = 'cannot be longer than 50 chars';
		}
		return error;
	}

	handleSubmit(evt) {
		this.props.onSubmit({
			payload: { tag: evt.target.elements.tag.value },
			type: TAG_ADDED
		});
		this.setState(() => INITIAL_STATE);
		evt.preventDefault();
	}

	render() {
		return (
			<Form className="p-3" onSubmit={this.handleSubmit}>
				<FormGroup row>
					<Label for="exampleEmail" xs={12} sm={2}>
						Tag:
					</Label>
					<Col xs={12} sm={7}>
						<Input
							onChange={this.handleChange}
							value={this.state.tag}
							type="text"
							name="tag"
							id="tag"
							placeholder="tag"
						/>
					</Col>
					<Col xs={12} className="hidden-sm-up errors">
						{this.state.error}
					</Col>
					<Col xs={12} sm={3}>
						<Button
							className="w-100"
							type="submit"
							disabled={
								this.state.error !== null || this.state.tag.length === 0
							}>
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

export default TagForm;
