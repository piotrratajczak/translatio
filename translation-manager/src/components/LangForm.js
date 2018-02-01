import React, { Component } from 'react';
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
			langCode: ''
		};

		this.handlechange = this.handlechange.bind(this);
	}

	handlechange({ target }) {
		this.setState({ langCode: target.value });
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

					<Col xs={12} sm={3}>
						<Button
							className="w-100"
							type="submit"
							disabled={!this.state.langCode.length}>
							Submit
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}

export default LangForm;
