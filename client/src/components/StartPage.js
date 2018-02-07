import './StartPage.css';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import React from 'react';

const StartPage = ({ languages, onDelete }) => (
	<div className="start-page mx-auto">
		<h4 className="languages-title">
			{languages.length
				? 'Available languages:'
				: 'No languages in Database. Please create one!'}
		</h4>
		<ListGroup className="horizontal-list">
			<ListGroupItem>
				<h6>NEW</h6>
				<Link className="btn btn-success btn-sm" to="/add/lang">
					Add lang
				</Link>
				{languages.length > 0 && (
					<Link className="btn btn-warning btn-sm" to="/add/tag">
						Add tag
					</Link>
				)}
			</ListGroupItem>
			{languages.map(langCode => (
				<ListGroupItem key={langCode}>
					<button
						type="button"
						className="close"
						aria-label="Close"
						onClick={() => onDelete(langCode)}>
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

StartPage.propTypes = {
	languages: PropTypes.arrayOf(PropTypes.string),
	onDelete: PropTypes.func.isRequired
};

StartPage.defaultProps = {
	languages: []
};

export default StartPage;
