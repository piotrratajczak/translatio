import './NoMatch.css';
import { PropTypes } from 'prop-types';
import React from 'react';

const NoMatchPage = ({ location }) => (
	<div className="no-match">
		<h3>{`You said "${location.pathname}"?`}</h3>
		<small>... sorry, never heard about it. </small>
	</div>
);

NoMatchPage.propTypes = {
	location: PropTypes.object //eslint-disable-line
};

export default NoMatchPage;
