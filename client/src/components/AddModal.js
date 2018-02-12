import './AddModal.css';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import AddForm from './AddForm';
import { CLOSE_FORM } from '../actions/form';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const AddModal = ({ modal, languages, dispatch }) => (
	<Modal isOpen={modal.show}>
		<ModalHeader toggle={() => dispatch({ type: CLOSE_FORM })}>
			Create New {modal.type}
		</ModalHeader>
		<ModalBody>
			<AddForm type={modal.type} languages={languages} />
		</ModalBody>
	</Modal>
);

AddModal.propTypes = {
	dispatch: PropTypes.func.isRequired,
	modal: PropTypes.shape({
		show: PropTypes.bool,
		type: PropTypes.string
	}),
	languages: PropTypes.arrayOf(PropTypes.string)
};

AddModal.defaultProps = {
	modal: null,
	languages: []
};

const mapStateToProps = state => ({
	modal: state.form,
	languages: Object.keys(state.data.langData)
});

export default connect(mapStateToProps)(AddModal);
