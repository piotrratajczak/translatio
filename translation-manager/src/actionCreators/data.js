import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET
} from '../actions/data';

export function propagateDbEvent(event) {
	return dispatch => {
		dispatch(event);
	};
}
