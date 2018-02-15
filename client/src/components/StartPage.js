import './StartPage.css';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import React, { Component } from 'react';
import Confirmation from './Confirmation';
import { FORM_OPEN } from '../actions/form';
import { LANG_DELETED } from '../actions/data';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Socket from '../modules/Socket';
import { connect } from 'react-redux';

const INITIAL_STATE = {
	modal: false,
	langCode: null
};

class StartPage extends Component {
	constructor() {
		super();

		this.state = INITIAL_STATE;

		Object.getOwnPropertyNames(StartPage.prototype)
			.filter(method => method.indexOf('handle') === 0)
			.forEach(method => {
				this[method] = this[method].bind(this);
			});
	}

	handleLangDelete(langCode) {
		this.setState({ modal: true, langCode });
	}

	handleModalConfirm() {
		Socket.emitClientEvent({
			type: LANG_DELETED,
			payload: { langCode: this.state.langCode }
		});
		this.setState({
			modal: false,
			langCode: null
		});
	}

	handleModalCancel() {
		this.setState(INITIAL_STATE);
	}

	handleAddClick(evt) {
		this.props.dispatch({ type: FORM_OPEN, payload: evt.target.name });
	}

	render() {
		const { languages } = this.props;
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
							name="lang"
							onClick={this.handleAddClick}>
							Add Lang
						</Button>
						{languages.length > 0 && (
							<Button
								size="sm"
								color="warning"
								name="tag"
								onClick={this.handleAddClick}>
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
								onClick={() => this.handleLangDelete(langCode)}>
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
	dispatch: PropTypes.func.isRequired,
	languages: PropTypes.arrayOf(PropTypes.string)
};

StartPage.defaultProps = {
	languages: []
};

const mapStateToProps = state => ({
	languages: Object.keys(state.data.langData)
});

export default connect(mapStateToProps)(StartPage);
