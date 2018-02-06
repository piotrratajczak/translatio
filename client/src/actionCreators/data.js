export default function propagateDbEvent(event) {
	return dispatch => {
		dispatch(event);
	};
}
