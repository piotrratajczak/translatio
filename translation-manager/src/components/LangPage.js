import React, { Component } from 'react';
import Translation from './Translation';
import { Form } from 'reactstrap';

class LangPage extends Component {
	constructor() {
		super();

		this.state = {
			lang: null,
			data: {}
		};

		this.checkLang = this.checkLang.bind(this);
		this.handleTranslationChange = this.handleTranslationChange.bind(this);
		this.handleSingleSave = this.handleSingleSave.bind(this);
	}

	componentWillMount() {
		console.log('MOUNT');
		this.checkLang();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.lang !== this.props.lang) {
			console.log('RECEIVE', nextProps.lang, this.props.lang);
			this.checkLang(nextProps);
		}
	}

	handleSingleSave(tag) {
		let data = { [tag]: this.state.data[tag] };
		this.props.onSave(this.state.lang, data);
	}

	//todo completeSAVE

	handleTranslationChange({ target }) {
		let tag = target.id;
		let value = target.value;

		this.setState({
			data: Object.assign({}, this.state.data, { [tag]: value })
		});
	}

	checkLang({ lang, data } = this.props) {
		if (lang !== this.state.lang) {
			console.log('CHANGING STATE');
			this.setState({ lang, data });
		}
	}

	// also todo saving form function

	render() {
		const { data } = this.state;
		let originalData = this.props.data;
		return (
			<Form>
				{data &&
					Object.keys(data)
						.sort()
						.map(tag => (
							<Translation
								tag={tag}
								translation={data[tag]}
								key={tag}
								original={originalData[tag]}
								onChange={this.handleTranslationChange}
								onSave={this.handleSingleSave}
							/>
						))}
			</Form>
		);
	}
}

export default LangPage;
