import {
	FETCH_TOKEN_FULFILLED,
	FETCH_TOKEN_FULFILLED_NONE,
	FETCH_TOKEN_PENDING,
	FETCH_TOKEN_REJECTED,
	LOGOUT,
} from '../actions/app';
import Auth from '../modules/Auth';

const API_URL = 'http://localhost:3001/'; // todo move to settings

export function loginUser(userData, history) {
	return (dispatch) => {
		dispatch({ type: FETCH_TOKEN_PENDING });

		return fetch(`${API_URL}login/`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then(response => response.json())
			.then((resp) => {
				if (resp.success) {
					if (resp.data) {
						// token
						dispatch({ type: FETCH_TOKEN_FULFILLED, payload: resp.data });
						Auth.setToken(resp.data);
						history.push('/');
					} else {
						dispatch({ type: FETCH_TOKEN_FULFILLED_NONE });
					}
				} else {
					throw new Error(resp.error || 'unknown error has happened!');
				}
			})
			.catch((err) => {
				dispatch({
					type: FETCH_TOKEN_REJECTED,
					payload: err,
				});
			});
	};
}

export function logoutUser() {
	return (dispatch) => {
		Auth.removeToken();
		dispatch({ type: LOGOUT });
	};
}
