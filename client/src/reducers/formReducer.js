import { FORM_CLOSE, FORM_OPEN, FORM_SET_LOADING } from '../actions/form';
import { LOGOUT } from '../actions/app';


const INITIAL_STATE = {
	show: false,
	type: null,
	loading: false,
	error: null,
	value: ''
};


function formReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
	case FORM_OPEN: {
		return {
			...state,
			show: state.loading ? state.show : true,
			type: state.loading ? null : action.payload
		};
	}

	case FORM_CLOSE: {
		return state.loading ? state : INITIAL_STATE;
	}

	case FORM_SET_LOADING: {
		return {
			...state,
			...action.payload
		};
	}

	case LOGOUT: {
		return INITIAL_STATE;
	}

	default:
		return state;
	}
}

export default formReducer;
