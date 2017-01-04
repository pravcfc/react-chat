import React, {Component, PropTypes} from 'react';

export default class ChatInput extends Component{
	static propTypes = {
		userID: PropTypes.number.isRequired,
		sendMessage: PropTypes.func.isRequired
	};

	componentDidMount(){
		this.refs.textMessage.focus();
	}

	onSubmit = (e) => {
		e.preventDefault();
		const message = this.refs.textMessage.value;
		if(message.length === 0){
			return ;
		}
		const messageObj = {
			who: this.props.userID,
			what: message,
			when: new Date().valueOf()
		};
		this.props.sendMessage(messageObj);
		//clear input and set focus
		this.refs.textMessage.value = '';
		this.refs.textMessage.focus();
	}

	render(){
		const {props, onSubmit} = this;
		const imageUrl = '//robohash.org/' + props.userID + '?set=set2&bgset=bg2&size=70x70';
		return(
			<footer className="teal">
			  <form className="container" onSubmit={onSubmit}>
			    <div className="row">
			      <div className="input-field col s10">
			        <i className="prefix mdi-communication-chat" />
			        <input ref="textMessage" type="text" placeholder="your message" />
			        <span className="chip left">
			          <img src={imageUrl} alt={imageUrl} />
			          <span>Anonymous robot #{props.userID}</span>
			        </span>
			      </div>
			      <div className="input-field col s2">
			        <button type="submit" className="waves-effect waves-light btn-floating btn-large">
			          <i className="mdi-content-send" />
			        </button>
			      </div>
			    </div>
			  </form>
		</footer>
		);
	}
}
