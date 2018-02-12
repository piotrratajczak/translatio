import './Translation.css';
import {
	Badge,
	Button,
	ButtonGroup,
	Collapse,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label
} from 'reactstrap';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

const INITIAL_STATE = {
	changed: false,
	outdated: false,
	show: false,
	value: ''
};

class Translation extends Component {
	constructor() {
		super();

		this.state = {
			...INITIAL_STATE
		};

		Object.getOwnPropertyNames(Translation.prototype)
			.filter(method => method.indexOf('handle') === 0)
			.forEach(method => {
				this[method] = this[method].bind(this);
			});
	}

	componentWillMount() {
		this.setState({ value: this.props.original });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.original !== this.props.original) {
			if (!this.state.changed || this.state.value === nextProps.original) {
				this.setState({ ...INITIAL_STATE, value: nextProps.original });
			} else {
				this.setState({ outdated: true });
			}
		}
	}

	handleOriginalClick() {
		this.setState({ show: !this.state.show });
	}

	handleChanges(evt) {
		this.setState({
			value: evt.target.value,
			changed: this.props.original !== evt.target.value
		});
	}

	handleDelete() {
		this.props.onDelete(this.props.tag);
	}

	handleUndoChanges() {
		this.setState({ ...INITIAL_STATE, value: this.props.original });
	}

	handleSaveChanges() {
		this.props.onSave({ [this.props.tag]: this.state.value });
		this.setState(INITIAL_STATE);
	}

	render() {
		const { tag, original } = this.props;
		const { changed, outdated, show } = this.state;
		return (
			<FormGroup className="bg-faded translation">
				<Label htmlFor={tag}>
					{tag}:{changed && <Badge color="danger">Unsaved</Badge>}
					{outdated && <Badge color="danger">Outdated</Badge>}
				</Label>

				<InputGroup>
					<Input
						onChange={this.handleChanges}
						type="text"
						id={tag}
						value={this.state.value}
						placeholder="NO TRANSLATION"
					/>

					<InputGroupAddon>
						<ButtonGroup>
							{changed && [
								<Button
									onClick={this.handleSaveChanges}
									color="primary"
									key="btnSave">
									Save
								</Button>,
								<Button
									color="faded"
									onClick={this.handleUndoChanges}
									key="btnUndo">
									Undo
								</Button>,
								<Button
									color="warning"
									onClick={this.handleOriginalClick}
									key="btnShow">
									{`${show ? 'Hide' : 'Show'} actual`}
								</Button>
							]}
							<Button color="danger" onClick={this.handleDelete}>
								Delete
							</Button>
						</ButtonGroup>
					</InputGroupAddon>
				</InputGroup>
				<Collapse isOpen={show}>
					<Input
						className="original"
						value={original}
						type="text"
						disabled
						placeholder="NO TRANSLATION"
					/>
				</Collapse>
			</FormGroup>
		);
	}
}

Translation.propTypes = {
	original: PropTypes.string.isRequired,
	tag: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired
};

export default Translation;
