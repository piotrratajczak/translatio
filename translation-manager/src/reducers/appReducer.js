import {
	FETCH_TOKEN,
	FETCH_TOKEN_FULFILLED,
	FETCH_TOKEN_FULFILLED_NONE,
	FETCH_TOKEN_PENDING,
	FETCH_TOKEN_REJECTED,
	LOGOUT,
	SET_TOKEN
} from '../actions/app';

const INITIAL_STATE = {
	initialized: false,
	token: null,
	loginStatus: null
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

		case FETCH_TOKEN_PENDING: {
			return {
				...state,
				loginStatus: 'pending'
			};
		}
		case FETCH_TOKEN_FULFILLED: {
			return {
				...state,
				token: action.payload,
				loginStatus: null
			};
		}
		case FETCH_TOKEN_FULFILLED_NONE: {
			return {
				...state,
				loginStatus: 'No user or  wrong password'
			};
		}
		case FETCH_TOKEN_REJECTED: {
			return {
				...state,
				loginStatus: 'There was an error'
			};
		}

		default:
			return state;
	}
}

export default appReducer;
