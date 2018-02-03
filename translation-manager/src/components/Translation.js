import './Translation.css';
import React, { Component } from 'react';
import {
	Collapse,
	InputGroupAddon,
	InputGroup,
	Button,
	ButtonGroup,
	FormGroup,
	Label,
	Input,
	FormText,
	Badge
} from 'reactstrap';

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

		this.handleUndoChanges = this.handleUndoChanges.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
		this.handleChanges = this.handleChanges.bind(this);
		this.toggleOriginal = this.toggleOriginal.bind(this);
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

	toggleOriginal() {
		this.setState({ show: !this.state.show });
	}

	handleChanges(evt) {
		this.setState({
			value: evt.target.value,
			changed: this.props.original !== evt.target.value
		});
	}

	handleUndoChanges() {
		this.setState({ ...INITIAL_STATE, value: this.props.original });
		this.props.onChange({
			target: { id: this.props.tag, value: this.props.original }
		});
	}

	handleSaveChanges() {
		this.props.onSave({ [this.props.tag]: this.state.value });
		this.setState(INITIAL_STATE);
	}

	render() {
		const { tag, translation, original } = this.props;
		const { changed, outdated, show } = this.state;
		return (
			<FormGroup>
				<Label for={tag}>
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
					{changed && (
						<InputGroupAddon>
							<ButtonGroup>
								<Button onClick={this.handleSaveChanges} color="primary">
									Save
								</Button>
								<Button color="danger" onClick={this.handleUndoChanges}>
									Undo
								</Button>
								<Button color="warning" onClick={this.toggleOriginal}>
									{`${show ? 'Hide' : 'Show'} actual`}
								</Button>
							</ButtonGroup>
						</InputGroupAddon>
					)}
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

export default Translation;
