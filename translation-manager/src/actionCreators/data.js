import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET,
	UPDATE_LANG_PENDING,
	UPDATE_LANG_REJECTED,
	UPDATE_LANG_FULFILLED
} from '../actions/data';

const API_URL = 'http://localhost:3001/'; // todo move to settings

export function propagateDbEvent(event) {
	return dispatch => {
		dispatch(event);
	};
}

export function updateLanguage(langCode, data) {
	return dispatch => {
		dispatch({ type: UPDATE_LANG_PENDING });

		return fetch(`${API_URL}lang/${langCode}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data })
		})
			.then(response => response.json())
			.then(resp => {
				if (resp.success) {
					dispatch({ type: UPDATE_LANG_FULFILLED });
				} else {
					throw new Error(resp.error || 'unknown error has happened!');
				}
			})
			.catch(err => {
				console.log(err);
				dispatch({
					type: UPDATE_LANG_REJECTED
				});
			});
	};
}
