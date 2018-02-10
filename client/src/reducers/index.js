import appReducer from './appReducer';
import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import formReducer from './formReducer';
import { reducer as notifications } from 'react-notification-system-redux';

const rootReducer = combineReducers({
	app: appReducer,
	data: dataReducer,
	form: formReducer,
	notifications
});

export default rootReducer;
