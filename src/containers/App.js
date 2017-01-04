import React, {Component, PropTypes} from 'react';
import ChatInput from '../components/ChatInput';
import ChatHistory from '../components/ChatHistory';
import {publishKey, subscribeKey, secretKey} from '../constants/pubnub.js';
import {connect} from 'react-redux';
import {addMessage, setCurrentUserID, addHistory} from '../actions/chat';
import PubNub from 'pubnub';

class App extends Component{
	static propTypes = {
		history: PropTypes.array,
		userID: PropTypes.number,
		addMessage: PropTypes.func,
		setCurrentUserID: PropTypes.func,
		addHistory: PropTypes.func,
		lastMessageTimestamp: PropTypes.string
	};

	sendMessage = (message) => {
		this.PUBNUB.publish({
			channel: 'ReactChat',
			message: message
		});
	}

	fetchHistory = () => {
		const {props} = this;
		this.PUBNUB.history({
			channel: 'ReactChat',
			count: 15,
			start: props.lastMessageTimestamp,
			callback: (data) => {
				props.addHistory(data[0], data[1]);
			}
		});
	}

	componentDidMount(){
		const userID = Math.round(Math.random() * 1000000);
		this.props.setCurrentUserID(userID);
		this.PUBNUB = PubNub.init({
			publish_key: publishKey,
			subscribe_key: subscribeKey,
			ssl: (location.protocol.toLowerCase() === 'https:'),
			secret_key: secretKey
		});
		this.PUBNUB.subscribe({
			channel: 'ReactChat',
			message: this.props.addMessage
		});
		this.fetchHistory();
	}

	render(){
		const {props, sendMessage, fetchHistory} = this;
		return(
			<div>
				<ChatHistory history={props.history} fetchHistory={fetchHistory} />
				<ChatInput userID={props.userID} sendMessage={sendMessage} />
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		history: state.app.get('messages').toJS(),
		userID: state.app.get('userID'),
		lastMessageTimestamp: state.app.get('lastMessageTimestamp')
	};
}

function mapDispatchToProps(dispatch){
	return {
		addMessage: (message) => dispatch(addMessage(message)),
		setCurrentUserID: (userID) => dispatch(setCurrentUserID(userID)),
		addHistory: (messages, timestamp) => dispatch(addHistory(messages, timestamp))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
