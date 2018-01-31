import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET
} from '../actions/data';

const API_URL = 'http://localhost:3001/'; // todo move to settings

export function propagateDbEvent(event) {
	return dispatch => {
		dispatch(event);
	};
}
