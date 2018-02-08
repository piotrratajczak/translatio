import './LangPage.css';
import { Badge, Button, Form } from 'reactstrap';
import React, { Component } from 'react';
import Confirmation from './Confirmation';
import { PropTypes } from 'prop-types';
import Translation from './Translation';

const INITIAL_STATE = { modal: false, tag: null };

class LangPage extends Component {
	constructor() {
		super();

		this.state = INITIAL_STATE;

		this.handleModalConfirm = this.handleModalConfirm.bind(this);
		this.handleModalCancel = this.handleModalCancel.bind(this);
		this.openModal = this.openModal.bind(this);
	}

	handleModalCancel() {
		this.setState(INITIAL_STATE);
	}

	openModal(tag) {
		this.setState({ modal: true, tag });
	}

	handleModalConfirm() {
		this.props.onDelete(this.state.tag);
		this.setState(INITIAL_STATE);
	}

	render() {
		const {
			data, onSave, onAddClick, langCode
		} = this.props;

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
				{!Object.keys(data).length && (
					<div className="info-text">
						<p>There are no tags yet! Please add one!</p>
						<Button size="sm" color="warning" onClick={() => onAddClick('tag')}>
							Add Tag
						</Button>
					</div>
				)}
				{data &&
					Object.keys(data)
						.sort()
						.map(tag => (
							<Translation
								tag={tag}
								key={tag}
								original={data[tag]}
								onDelete={this.openModal}
								onSave={onSave}
							/>
						))}
			</Form>
		);
	}
}

LangPage.propTypes = {
	onAddClick: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired, //eslint-disable-line
	langCode: PropTypes.string
};

LangPage.defaultProps = {
	langCode: null
};

export default LangPage;
