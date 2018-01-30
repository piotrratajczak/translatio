import './NoMatch.css';
import React from 'react';

const NoMatchPage = ({ location }) => (
	<div className="no-match">
		<h3>{`You said "${location.pathname}"?`}</h3>
		<small>... sorry, never heard about it. </small>
	</div>
);

export default NoMatchPage;
