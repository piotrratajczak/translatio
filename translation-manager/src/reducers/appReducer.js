import {
	FETCH_TOKEN,
	FETCH_TOKEN_FULFILLED,
	FETCH_TOKEN_PENDING,
	FETCH_TOKEN_REJECTED,
	LOGOUT,
	SET_TOKEN
} from '../actions/app';

const INITIAL_STATE = {
	initialized: false,
	token: null
};

function appReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_TOKEN: {
			return {
				...state,
				initialized: true,
				token: action.payload
			};
		}

		case FETCH_TOKEN_FULFILLED: {
			return {
				...state,
				token: action.payload
			};
		}

		default:
			return state;
	}
}

export default appReducer;
