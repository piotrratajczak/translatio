import { CLOSE_FORM, OPEN_FORM } from '../actions/form';

const INITIAL_STATE = {
	show: false,
	type: null
};

function formReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
	case OPEN_FORM: {
		return {
			...state,
			show: true,
			type: action.payload
		};
	}

	case CLOSE_FORM: {
		return INITIAL_STATE;
	}

	default:
		return state;
	}
}

export default formReducer;
