import React from 'react';

const LangPage = props => (
	<div>
		{props.data && Object.keys(props.data).map(tag => <div> {tag} </div>)}
	</div>
);

export default LangPage;
