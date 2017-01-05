import React, {Component, PropTypes} from 'react';
import * as ReactDOM from 'react-dom';

export default class ChatHistory extends Component{
    static propTypes = {
        history:    PropTypes.array.isRequired,
        fetchHistory: PropTypes.func.isRequired
    };

    onScroll = () => {
        const {refs, props} = this;
        const scrollTop = refs.messageList.scrollTop;
        if(scrollTop === 0){
            props.fetchHistory();
        }
    }

    scrollToBottom = () => {
        const {messageList} = this.refs;
        const scrollHeight = messageList.scrollHeight;
        const clientHeight = messageList.clientHeight;
        const scrollTop = scrollHeight - clientHeight;
        ReactDOM.findDOMNode(messageList).scrollTop = scrollTop > 0 ? scrollTop : 0;
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    componentWillUpdate(nextProps){
        this.historyChanged = nextProps.history.length !== this.props.history.length;
        if(this.historyChanged){
            const {messageList} = this.refs;
            const scrollPos = messageList.scrollTop;
            const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
            this.scrollAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom);
        }
    }

    render(){
        const {props, onScroll} = this;
        return (
            <ul className="collection" ref="messageList" onScroll={onScroll}>
            { props.history.map((messageObj) => {
                const imageUrl = '//robohash.org/' + messageObj.who + '?set=set2&bgset=bg2&size=70x70';
                const messageDate = new Date(messageObj.when);
                const messageDateTime = messageDate.toLocaleTimeString() + ' on ' + messageDate.toLocaleDateString();
                return (<li className="collection-item avatar" key={messageObj.when}>
                    <img src={imageUrl} alt={messageObj.who} className="circle" />
                    <span className="title">Anonymous robot #{messageObj.who}</span>
                    <p>
                        <i className="prefix mdi-action-alarm" />
                        <span className="message-date"> {messageDateTime}</span>
                        <br />
                        <span>{messageObj.what}</span>
                   </p>
               </li>);
              })
            }
          </ul>
      );
  }
}
