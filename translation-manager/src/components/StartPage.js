import './StartPage.css';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { PropTypes } from 'prop-types';
import React from 'react';
import startImg from '../img/startPage.jpg';

const StartPage = ({ languages }) => (
	<div>
		<img src={startImg} className="img-fluid" alt="start page translations" />
		<h4>Avaible translation file downloads:</h4>
		<ListGroup className="horizontal-list">
			{languages.map(langCode => (
				<ListGroupItem key={langCode}>
					<a
						className="btn btn-primary"
						href={`/api/lang/file/${langCode}`}
						download={`${langCode}.json`}>
						{langCode}
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
