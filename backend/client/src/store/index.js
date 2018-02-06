import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
	middlewares.push(createLogger({ diff: true }));
}

const middleware = applyMiddleware(...middlewares);

const store = createStore(rootReducer, compose(middleware));

export default store;
