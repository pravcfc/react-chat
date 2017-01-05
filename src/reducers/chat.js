import {ADD_MESSAGE, SET_CURRENT_USERID, ADD_HISTORY} from '../constants/actionTypes';
import {fromJS} from 'immutable';

const INITIAL_STATE = fromJS({
    userID: 0,
    messages: [],
    lastMessageTimestamp: null
});

export default function chatReducer(state = INITIAL_STATE, action = {}){
    switch(action.type){
        case SET_CURRENT_USERID:
            return state.update('userID', () => action.payload);
        case ADD_MESSAGE:
            soundBell(action.payload, state);
            return state.update('messages', (messages) => messages.concat(action.payload));
        case ADD_HISTORY:
            return state
            .update('messages', (messages) => messages.unshift(...action.payload.messages))
            .update('lastMessageTimestamp', () => action.payload.timestamp);
        default:
            return state;
    }
}

function soundBell(message, state){
    const otherUserID = state._root.entries[0][1];
    if(otherUserID && message.who && message.who !== otherUserID){
        document.getElementById('audioElement').play();
    }
}
