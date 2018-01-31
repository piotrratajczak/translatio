import './Translation.css';
import React from 'react';
import {
	InputGroupAddon,
	InputGroup,
	Button,
	FormGroup,
	Label,
	Input,
	FormText,
	Badge
} from 'reactstrap';

//todo maybe form text if text is longer than ...xxxx

// todo indicator that there is saving happening!!!!

const Translation = ({ tag, translation, onChange, original, onSave }) => {
	const changed = translation !== original;
	return (
		<FormGroup>
			<Label for={tag}>
				{tag}:{changed && <Badge color="danger">Unsaved Change!</Badge>}
			</Label>
			<InputGroup>
				<Input
					onChange={onChange}
					type="text"
					id={tag}
					value={translation}
					placeholder="NO TRANSLATION"
				/>
				{changed && (
					<InputGroupAddon>
						<Button onClick={evt => onSave(tag)} color="primary">
							Save only this change
						</Button>
					</InputGroupAddon>
				)}
			</InputGroup>
		</FormGroup>
	);
};

export default Translation;
