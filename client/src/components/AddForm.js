import './AddForm.css';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { FORM_CLOSE, FORM_SET_LOADING } from '../actions/form';
import { LANG_ADDED, TAG_ADDED } from '../actions/data';
import React, { Component } from 'react';
import Loader from './Loader';
import { PropTypes } from 'prop-types';
import Socket from '../modules/Socket';
import { connect } from 'react-redux';

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

		Object.getOwnPropertyNames(AddForm.prototype)
			.filter(method => method.indexOf('handle') === 0)
			.forEach(method => {
				this[method] = this[method].bind(this);
			});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.modal.loading && !nextProps.modal.loading) {
			this.handleDbResponse(nextProps);
		}
	}

	handleDbResponse({ modal }) {
		const { error, value } = modal;
		if (error) {
			this.setState({ error, value });
		}
	}

	handleChange({ target }) {
		const { value } = target;
		const error = this.validateValue(value);
		this.setState({ value, error });
	}

	handleModalClose() {
		this.setState(() => INITIAL_STATE);
		this.props.dispatch({ type: FORM_CLOSE });
	}

	validateValue(value) {
		return this.props.modal.type === 'tag'
			? tagValidation(value)
			: langCodeValidation(value, this.props.languages);
	}

	handleSubmit(evt) {
		const type = this.props.modal.type === 'tag' ? 'tag' : 'langCode';
		const payload = { [type]: evt.target.elements.value.value };
		if (this.props.modal.type === 'tag') {
			this.props.languages.forEach(lang => {
				payload[lang] = evt.target.elements[lang].value;
			});
		}
		this.props.dispatch({
			type: FORM_SET_LOADING,
			payload: {
				loading: true,
				value: this.state.value
			}
		});
		Socket.emitClientEvent({
			payload,
			type: this.props.modal.type === 'tag' ? TAG_ADDED : LANG_ADDED
		});

		this.setState(() => INITIAL_STATE);
		evt.target.reset();
		evt.preventDefault();
	}

	render() {
		const { modal, languages } = this.props;
		const renderInfo =
			modal.type === 'tag' && !languages.length;
		return (
			<Modal isOpen={modal.show}>
				<ModalHeader toggle={modal.loading ? null : this.handleModalClose}>
					Create New {modal.type}
				</ModalHeader>
				<ModalBody>
					<Form className="p-3 add-form" onSubmit={this.handleSubmit}>
						{modal.loading && <Loader />}
						{!modal.loading && renderInfo && (
							<p className="info-text">
								Please create any language before you create a tag!
							</p>
						)}
						{!modal.loading && !renderInfo && (
							<FormGroup row>
								<Label htmlFor="value" xs={12} sm={2}>
									{modal.type}:
								</Label>
								<Col xs={12} sm={7}>
									<Input
										onChange={this.handleChange}
										value={this.state.value}
										type="text"
										name="value"
										id="value"
										placeholder={modal.type}
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
											this.state.error !== null || !this.state.value.length
										}>
										Submit
									</Button>
								</Col>
								<Col className="hidden-xs-down errors" xs={12}>
									{this.state.error}
								</Col>
							</FormGroup>
						)}
						{!renderInfo &&
							modal.type === 'tag' && (
								<div>
									<hr />
									{languages.map(lang => (
										<FormGroup row key={lang}>
											<Label className="lang-code" htmlFor={lang} xs={12} sm={2}>
												{lang}:
											</Label>
											<Col xs={12} sm={7}>
												<Input
													type="text"
													name={lang}
													id={lang}
													placeholder="NO TRANSLATION"
												/>
											</Col>
										</FormGroup>
									))}
								</div>
							)}
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}

AddForm.propTypes = {
	dispatch: PropTypes.func.isRequired,
	modal: PropTypes.shape({
		show: PropTypes.bool,
		type: PropTypes.string,
		loading: PropTypes.bool
	}),
	languages: PropTypes.arrayOf(PropTypes.string)
};

AddForm.defaultProps = {
	modal: null,
	languages: []
};

const mapStateToProps = state => ({
	modal: state.form,
	languages: Object.keys(state.data.langData)
});

export default connect(mapStateToProps)(AddForm);
