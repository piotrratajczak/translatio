import { Form } from 'reactstrap';
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

export default LangPage;
