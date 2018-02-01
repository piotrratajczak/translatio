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
	show: false
};

class Translation extends Component {
	constructor() {
		super();

		this.state = {
			changed: false,
			outdated: false,
			show: false
		};

		this.handleUndoChanges = this.handleUndoChanges.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
		this.handleChanges = this.handleChanges.bind(this);
		this.toggleOriginal = this.toggleOriginal.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.original !== this.props.original) {
			if (
				!this.state.changed ||
				this.props.translation === nextProps.original
			) {
				this.setState(INITIAL_STATE);
				this.props.onChange({
					target: { id: this.props.tag, value: nextProps.original }
				});
			} else {
				this.setState({ outdated: true });
			}
		}
	}

	toggleOriginal() {
		this.setState({ show: !this.state.show });
	}

	handleChanges(evt) {
		this.setState({ changed: this.props.original !== evt.target.value });
		this.props.onChange(evt);
	}

	handleUndoChanges() {
		this.setState(INITIAL_STATE);
		this.props.onChange({
			target: { id: this.props.tag, value: this.props.original }
		});
	}

	handleSaveChanges() {
		this.setState(INITIAL_STATE);
		this.props.onSave(this.props.tag);
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
						value={translation}
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
									{`${show ? 'Hide' : 'Show'} original`}
								</Button>
							</ButtonGroup>
						</InputGroupAddon>
					)}
				</InputGroup>
				<Collapse isOpen={show}>
					<Input className="original" value={original} type="text" disabled />
				</Collapse>
			</FormGroup>
		);
	}
}

//todo maybe form text if text is longer than ...xxxx

export default Translation;
