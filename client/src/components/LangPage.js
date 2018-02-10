import './LangPage.css';
import { Badge, Button, Form } from 'reactstrap';
import { LANG_UPDATED, TAG_DELETED } from '../actions/data';
import React, { Component } from 'react';
import Confirmation from './Confirmation';
import Loader from './Loader';
import { OPEN_FORM } from '../actions/form';
import { PropTypes } from 'prop-types';
import Socket from '../modules/Socket';
import Translation from './Translation';
import { connect } from 'react-redux';

const INITIAL_STATE = { modal: false, tag: null };

class LangPage extends Component {
	constructor() {
		super();

		this.state = INITIAL_STATE;

		this.handleModalConfirm = this.handleModalConfirm.bind(this);
		this.handleModalCancel = this.handleModalCancel.bind(this);
		this.openModal = this.openModal.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleAddClick = this.handleAddClick.bind(this);
	}

	handleModalCancel() {
		this.setState(INITIAL_STATE);
	}

	openModal(tag) {
		this.setState({ modal: true, tag });
	}

	handleModalConfirm() {
		Socket.emitClientEvent({
			type: TAG_DELETED,
			payload: { tag: this.state.tag }
		});

		this.setState(INITIAL_STATE);
	}

	handleSave(data) {
		Socket.emitClientEvent({
			type: LANG_UPDATED,
			payload: { langCode: this.props.match.params.langCode, data }
		});
	}

	handleAddClick(evt) {
		this.props.dispatch({ type: OPEN_FORM, payload: evt.target.name });
	}

	render() {
		const { data, initialized } = this.props;
		const { langCode } = this.props.match.params;
		const dataFix = data[langCode];

		if (!initialized) {
			return <Loader />;
		}

		if (!data) {
			return (
				<p className="text-center">
					Are you sure there should be such a language available?
				</p>
			);
		}

		return (
			<Form className="lang-page">
				<Confirmation
					open={this.state.modal}
					type="tag"
					onConfirm={this.handleModalConfirm}
					onCancel={this.handleModalCancel}
				/>
				<h1 className="bg-faded">
					<Badge color="primary">{langCode}</Badge>
				</h1>
				{!Object.keys(dataFix).length && (
					<div className="info-text">
						<p>There are no tags yet! Please add one!</p>
						<Button
							size="sm"
							color="warning"
							name="tag"
							onClick={this.handleAddClick}>
							Add Tag
						</Button>
					</div>
				)}
				{data &&
					Object.keys(dataFix)
						.sort()
						.map(tag => (
							<Translation
								tag={tag}
								key={tag}
								original={dataFix[tag]}
								onDelete={this.openModal}
								onSave={this.handleSave}
							/>
						))}
			</Form>
		);
	}
}

LangPage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	initialized: PropTypes.bool,
	data: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
	langCode: PropTypes.string,
	match: PropTypes.shape({
		params: PropTypes.shape({
			langCode: PropTypes.string
		})
	}).isRequired
};

LangPage.defaultProps = {
	initialized: false,
	langCode: null,
	data: null
};

const mapStateToProps = state => ({
	data: state.data.langData,
	initialized: state.data.initialized
});

export default connect(mapStateToProps)(LangPage);
