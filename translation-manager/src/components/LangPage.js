import React, { Component } from 'react';
import Translation from './Translation';
import { Form } from 'reactstrap';

class LangPage extends Component {
	constructor() {
		super();

		this.state = {
			lang: null,
			langData: {}
		};

		this.checkLang = this.checkLang.bind(this);
	}

	componentWillMount() {}

	componentWillReceiveProps(nextProps) {}

	checkLang(props = this.props) {
		if (props.lang !== this.state.lang) {
			console.log('LANG CHANGE TODO!');
		}
	}

	// also todo saving form function

	render() {
		const { data } = this.props;
		return (
			<Form>
				{data &&
					Object.keys(data)
						.sort()
						.map(tag => (
							<Translation tag={tag} translation={data[tag]} key={tag} />
						))}
			</Form>
		);
	}
}

export default LangPage;
