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
		this.checkLang();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.lang !== this.props.lang) {
			this.checkLang(nextProps);
		}

		const nextKeys = Object.keys(nextProps.data);
		const presentKeys = Object.keys(this.state.data);

		if (nextKeys.length > presentKeys.length) {
			this.setState(() => Object.assign({}, nextProps.data, this.state.data));
		}
	}

	handleSingleSave(tag) {
		let data = { [tag]: this.state.data[tag] };
		this.props.onSave(this.state.lang, data);
	}

	handleTranslationChange({ target }) {
		let tag = target.id;
		let value = target.value;

		this.setState({
			data: Object.assign({}, this.state.data, { [tag]: value })
		});
	}

	checkLang({ lang, data } = this.props) {
		if (lang !== this.state.lang) {
			this.setState({ lang, data });
		}
	}

	render() {
		const { data } = this.state;
		let originalData = this.props.data;
		return (
			<Form>
				{data &&
					Object.keys(originalData)
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
