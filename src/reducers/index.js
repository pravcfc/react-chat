import chatReducer from './chat';
import {combineReducers} from 'redux';

export const rootReducer = combineReducers({
    // routing: routerReducer,
    app: chatReducer
});
