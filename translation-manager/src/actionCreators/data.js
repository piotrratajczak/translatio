import {
	LANG_ADDED,
	LANG_UPDATED,
	TAG_ADDED,
	INITIAL_LANGUAGE_SET,
	FETCH_LANG_DATA_REJECTED,
	FETCH_LANG_DATA_FULFILLED,
	FETCH_LANG_DATA_PENDING
} from '../actions/data';

const API_URL = 'http://localhost:3001/'; // todo move to settings

export function propagateDbEvent(event) {
	return dispatch => {
		dispatch(event);
	};
}

export function fetchLang(langCode) {
	// return dispatch => {
	// 	dispatch({ type: FETCH_LANG_PENDING });
	//
	// 	return fetch(`${API_URL}login/`, {
	// 		method: 'POST',
	// 		headers: {
	// 			Accept: 'application/json, text/plain, */*',
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(userData)
	// 	})
	// 		.then(response => response.json())
	// 		.then(resp => {
	// 			if (resp.success) {
	// 				if (resp.data) {
	// 					//token
	// 					dispatch({ type: FETCH_LANG_FULFILLED, payload: resp.data });
	// 					Auth.setToken(resp.data);
	// 					history.push('/');
	// 				} else {
	// 					dispatch({ type: FETCH_LANG_FULFILLED_NONE });
	// 				}
	// 			} else {
	// 				throw new Error(resp.error || 'unknown error has happened!');
	// 			}
	// 		})
	// 		.catch(err => {
	// 			dispatch({
	// 				type: FETCH_TOKEN_REJECTED
	// 			});
	// 		});
	// };
}
