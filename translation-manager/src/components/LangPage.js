import { Form } from 'reactstrap';
import { PropTypes } from 'prop-types';
import React from 'react';
import Translation from './Translation';

const LangPage = ({ data, onSave }) => (
	<Form>
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
