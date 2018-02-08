import './LangPage.css';
import { Button, Form } from 'reactstrap';
import { PropTypes } from 'prop-types';
import React from 'react';
import Translation from './Translation';

const LangPage = ({
	data, onSave, onDelete, onAddClick
}) => (
	<Form className="lang-page">
		{!Object.keys(data).length && (
			<div className="info-text">
				<p>There are no tags yet! Please add one!</p>
				<Button size="sm" color="warning" onClick={() => onAddClick('tag')}>
					Add Tag
				</Button>
			</div>
		)}
		{data &&
			Object.keys(data)
				.sort()
				.map(tag => (
					<Translation
						tag={tag}
						key={tag}
						original={data[tag]}
						onDelete={onDelete}
						onSave={onSave}
					/>
				))}
	</Form>
);

LangPage.propTypes = {
	onAddClick: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired //eslint-disable-line
};

export default LangPage;
