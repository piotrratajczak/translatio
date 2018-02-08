import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { PropTypes } from 'prop-types';
import React from 'react';

const Confirmation = props => (
	<Modal isOpen={props.open}>
		<ModalHeader>Deleting {props.type}</ModalHeader>
		<ModalBody>Are you sure? You can not undo it later.</ModalBody>
		<ModalFooter>
			<Button color="primary" onClick={props.onConfirm}>
				Confirm
			</Button>
			<Button color="secondary" onClick={props.onCancel}>
				Cancel
			</Button>
		</ModalFooter>
	</Modal>
);

Confirmation.propTypes = {
	open: PropTypes.bool,
	type: PropTypes.string,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};

Confirmation.defaultProps = {
	open: false,
	type: null
};

export default Confirmation;
