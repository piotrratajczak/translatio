export default function propagateDbEvent(data) {
	return dispatch => {
		dispatch(data);
	};
}
