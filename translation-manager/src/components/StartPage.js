import './StartPage.css';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import React from 'react';
import startImg from '../img/startPage.jpg';

const StartPage = ({ languages }) => (
	<div>
		<img src={startImg} className="img-fluid" alt="start page translations" />
		<h4>Available languages:</h4>
		<ListGroup className="horizontal-list">
			{languages.map(langCode => (
				<ListGroupItem key={langCode}>
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
	languages: PropTypes.arrayOf(PropTypes.string)
};

StartPage.defaultProps = {
	languages: []
};

export default StartPage;
