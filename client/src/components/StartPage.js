import './StartPage.css';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import React, { Component } from 'react';
import Confirmation from './Confirmation';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const INITIAL_STATE = {
	modal: false,
	langCode: null
};

class StartPage extends Component {
	constructor() {
		super();

		this.state = INITIAL_STATE;

		this.handleModalCancel = this.handleModalCancel.bind(this);
		this.openModal = this.openModal.bind(this);
		this.handleModalConfirm = this.handleModalConfirm.bind(this);
	}

	openModal(langCode) {
		this.setState({ modal: true, langCode });
	}

	handleModalConfirm() {
		this.props.onDelete(this.state.langCode);
		this.setState({
			modal: false,
			langCode: null
		});
	}

	handleModalCancel() {
		this.setState(INITIAL_STATE);
	}

	render() {
		const { languages, onAddClick } = this.props;
		return (
			<div className="start-page mx-auto">
				<Confirmation
					open={this.state.modal}
					type="Lang"
					onConfirm={this.handleModalConfirm}
					onCancel={this.handleModalCancel}
				/>
				<h4 className="languages-title">
					{languages.length
						? 'Available languages:'
						: 'No languages in Database. Please create one!'}
				</h4>
				<ListGroup className="horizontal-list">
					<ListGroupItem>
						<h6>NEW</h6>
						<Button
							size="sm"
							color="success"
							onClick={() => onAddClick('lang')}>
							Add Lang
						</Button>
						{languages.length > 0 && (
							<Button
								size="sm"
								color="warning"
								onClick={() => onAddClick('tag')}>
								Add Tag
							</Button>
						)}
					</ListGroupItem>
					{languages.map(langCode => (
						<ListGroupItem key={langCode}>
							<button
								type="button"
								className="close"
								aria-label="Close"
								onClick={() => this.openModal(langCode)}>
								<span aria-hidden="true">&times;</span>
							</button>
							<h6>{langCode}</h6>
							<Link className="btn btn-primary btn-sm" to={`/lang/${langCode}`}>
								Edit
							</Link>
							<a
								className="btn btn-info btn-sm"
								href={`/api/lang/file/${langCode}`}
								download={`${langCode}.json`}
								onClick={e => {
									e.stopPropagation();
								}}>
								Download
							</a>
						</ListGroupItem>
					))}
				</ListGroup>
			</div>
		);
	}
}

StartPage.propTypes = {
	languages: PropTypes.arrayOf(PropTypes.string),
	onDelete: PropTypes.func.isRequired,
	onAddClick: PropTypes.func.isRequired
};

StartPage.defaultProps = {
	languages: []
};

export default StartPage;
