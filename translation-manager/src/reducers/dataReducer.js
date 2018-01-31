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

		case LANG_UPDATED: {
			return {
				...state,
				langData: {
					...state.langData,
					[action.payload.langCode]: {
						...state.langData[action.payload.langCode],
						...action.payload.tags
					}
				}
			};
		}

		default:
			return state;
	}
}

export default appReducer;
