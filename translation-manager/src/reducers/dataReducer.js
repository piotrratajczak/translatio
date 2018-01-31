import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET
} from '../actions/data';

const INITIAL_STATE = {
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
