import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET,
	FETCH_LANG_DATA_REJECTED,
	FETCH_LANG_DATA_FULFILLED,
	FETCH_LANG_DATA_PENDING
} from '../actions/data';

const INITIAL_STATE = {
	action: null,
	languages: [],
	langData: {}
};

function appReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case INITIAL_LANGUAGE_SET: {
			return {
				...state,
				langData: action.payload
			};
		}

		default:
			return state;
	}
}

export default appReducer;
