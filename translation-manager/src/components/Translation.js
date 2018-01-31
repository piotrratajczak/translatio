import React from 'react';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

//todo maybe form text if text is longer than ...xxxx

const Translation = ({ tag, translation }) => (
	<FormGroup>
		<Label for={tag}>{tag}:</Label>
		<Input
			type="text"
			id={tag}
			value={translation}
			placeholder="NO TRANSLATION"
		/>
	</FormGroup>
);

export default Translation;
