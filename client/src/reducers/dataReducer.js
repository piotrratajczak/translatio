import {
	FETCH_EMPTY_FULFILLED,
	FETCH_EMPTY_PENDING,
	FETCH_EMPTY_REJECTED,
	INITIAL_LANGUAGE_SET,
	LANG_ADDED,
	LANG_DELETED,
	LANG_UPDATED,
	TAG_ADDED,
	TAG_DELETED
} from '../actions/data';

import { LOGOUT } from '../actions/app';

const INITIAL_STATE = {
	langData: {},
	initialized: false,
	extraData: {},
	fetchingError: false
};

function dataReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
	case INITIAL_LANGUAGE_SET: {
		return {
			...state,
			langData: action.payload,
			initialized: true
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

	case LANG_ADDED: {
		return {
			...state,
			langData: {
				...state.langData,
				...action.payload
			}
		};
	}

	case LANG_DELETED: {
		const langData = Object.assign({}, state.langData);
		delete langData[action.payload.langCode];
		return {
			...state,
			langData
		};
	}

	case TAG_ADDED: {
		const langData = Object.assign({}, state.langData);
		Object.keys(action.payload).forEach(langCode => {
			langData[langCode] = Object.assign(
				{},
				langData[langCode],
				action.payload[langCode]
			);
		});
		return {
			...state,
			langData
		};
	}

	case TAG_DELETED: {
		const langData = Object.assign({}, state.langData);
		Object.keys(langData).forEach(langCode => {
			delete langData[langCode][action.payload.tag];
		});
		return {
			...state,
			langData
		};
	}

	case LOGOUT: {
		return INITIAL_STATE;
	}

	case FETCH_EMPTY_PENDING: {
		return {
			...state,
			extraData: {}
		};
	}

	case FETCH_EMPTY_FULFILLED: {
		return {
			...state,
			extraData: action.payload,
			fetchingError: false
		};
	}

	case FETCH_EMPTY_REJECTED: {
		return {
			...state,
			fetchingError: true
		};
	}

	default:
		return state;
	}
}

export default dataReducer;
