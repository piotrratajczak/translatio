import {
	INITIAL_LANGUAGE_SET,
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
} from '../actions/data';

import { LOGOUT } from '../actions/app';

const INITIAL_STATE = {
	langData: {},
};

function appReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
	case INITIAL_LANGUAGE_SET: {
		return {
			...state,
			langData: action.payload,
		};
	}

	case LANG_UPDATED: {
		return {
			...state,
			langData: {
				...state.langData,
				[action.payload.langCode]: {
					...state.langData[action.payload.langCode],
					...action.payload.tags,
				},
			},
		};
	}

	case LANG_ADDED: {
		return {
			...state,
			langData: {
				...state.langData,
				...action.payload,
			},
		};
	}

	case TAG_ADDED: {
		const langData = Object.assign({}, state.langData);
		Object.keys(action.payload).forEach((langCode) => {
			langData[langCode] = Object.assign(
				{},
				langData[langCode],
				action.payload[langCode],
			);
		});
		return {
			...state,
			langData,
		};
	}

	case LOGOUT: {
		return INITIAL_STATE;
	}

	default:
		return state;
	}
}

export default appReducer;
