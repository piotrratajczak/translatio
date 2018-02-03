import React from 'react';
import Translation from './Translation';
import { Form } from 'reactstrap';

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
