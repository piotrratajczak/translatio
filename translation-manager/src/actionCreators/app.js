import {
	FETCH_TOKEN,
	FETCH_TOKEN_FULFILLED,
	FETCH_TOKEN_PENDING,
	FETCH_TOKEN_REJECTED,
	LOGOUT,
	SET_TOKEN
} from '../actions/app';
import Auth from '../modules/Auth';

const API_URL = 'http://localhost:3001/'; // to move to settings

export function logUser(userData, history) {
	return dispatch => {
		dispatch({ type: FETCH_TOKEN_PENDING });

		return fetch(`${API_URL}login/`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		})
			.then(response => response.json())
			.then(data => {
				dispatch({ type: FETCH_TOKEN_FULFILLED });
				if (data.token) {
					Auth.setToken(data.token);
					dispatch({ type: SET_TOKEN, payload: data.token });
					history.push('/');
				}
			})
			.catch(err => {
				console.log(err);
				dispatch({
					type: FETCH_TOKEN_REJECTED
				});
			});
	};
}
