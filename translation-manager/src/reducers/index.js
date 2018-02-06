import appReducer from './appReducer';
import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import { reducer as notifications } from 'react-notification-system-redux';

const rootReducer = combineReducers({
	app: appReducer,
	data: dataReducer,
	notifications
});

export default rootReducer;
