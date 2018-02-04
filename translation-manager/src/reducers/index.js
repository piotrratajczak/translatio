import appReducer from './appReducer';
import { combineReducers } from 'redux';
import dataReducer from './dataReducer';

const rootReducer = combineReducers({
	app: appReducer,
	data: dataReducer
});

export default rootReducer;
