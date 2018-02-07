import './LangPage.css';
import { Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import React from 'react';
import Translation from './Translation';

const LangPage = ({ data, onSave }) => (
	<Form className="lang-page">
		{!Object.keys(data).length && (
			<div className="info-text">
				<p>There are no tags yet! Please add one!</p>
				<Link className="btn btn-warning btn-sm" to="/add/tag">
					Add tag
				</Link>
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
						onSave={onSave}
					/>
				))}
	</Form>
);

LangPage.propTypes = {
	onSave: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired //eslint-disable-line
};

export default LangPage;
