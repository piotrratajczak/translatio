import {
	FETCH_EMPTY_FULFILLED,
	FETCH_EMPTY_PENDING,
	FETCH_EMPTY_REJECTED
} from '../actions/data';

import ActionHelper from '../modules/ActionHelper';

export default function fetchEmpty() {
	return (dispatch, getState) => {
		const state = getState();

		dispatch({ type: FETCH_EMPTY_PENDING });

		return fetch('/api/extra/empty', {
			headers: {
				'x-access-token': state.app.token
			}
		})
			.then(response => response.json())
			.then(resp => {
				if (resp.success) {
					dispatch({ type: FETCH_EMPTY_FULFILLED, payload: resp.data });
				} else {
					throw new Error(resp.message || 'unknown error has happened!');
				}
			})
			.catch(err => {
				const not = ActionHelper.getNotification({
					error: err.message,
					action: FETCH_EMPTY_REJECTED
				});
				dispatch(not);
				dispatch({
					type: FETCH_EMPTY_REJECTED,
					payload: err
				});
			});
	};
}
