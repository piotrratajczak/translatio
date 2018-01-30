const INITIAL_STATE = {
	initialized: false,
	token: null
};

function appReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'SET_TOKEN': {
			return {
				...state,
				initialized: true,
				token: action.payload
			};
		}

		default:
			return state;
	}
}

export default appReducer;
