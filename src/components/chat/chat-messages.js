/* -------------------------------------------------------------------
Chat-messages component:
This component focuses on displaying the chat messages between to users.
The style of the message differs if the message belongs to you or the other user.
Each new message is added to the DOM when the send button is clicked.
---------------------------------------------------------------------- */

import React, { Component } from 'react';
import './chat.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

class ChatMessages extends Component {

  componentDidMount() {
    this.props.socket.on('chat message', (msg) => {
      let currentId = this.props.socket.id;
      let oneMessage = document.createElement('div');
      let messages = document.getElementById('messages').appendChild(oneMessage);
      oneMessage.className += ' oneMessage';
      let messageText = document.createElement('div');
      let messageDate = document.createElement('div');
      oneMessage.appendChild(messageText);
      messageText.innerHTML = msg.value;
      oneMessage.appendChild(messageDate);
      messageDate.innerHTML = msg.date;
      messageDate.className += ' messageDate';
      if (currentId === msg.id) messages.className += ' myMessage';
      else messages.className += ' elseMessage';
      this.scrollToBottom();
    });
  }

  scrollToBottom = () => {
    const messages = document.getElementById('messages');
    let shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
    if (!shouldScroll) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  clickButton = (e) => {
    e.preventDefault();
    this.sendMessage();
  }

  detectEnter = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage = () => {
    if (this.message.value !== '') {
      const dateNow = new Date();
      const dateNowFormatted = dateNow.toLocaleString();
      const msgToSend = {
        date: dateNowFormatted,
        id: this.props.socket.id,
        value: this.message.value,
        room: this.props.room
      };
      this.props.socket.emit('chat message', msgToSend);
      this.message.value = '';
    }
  }

  componentWillMount() {
    this.props.socket.removeListener('chat message');
  }

  render() {
    return (
      <div className="chat-box">
        <div id="messages"></div>
        <form className="form-wrapper" action="">
          <textarea wrap="hard" placeholder="Type your message" className="message-field" autoComplete="off" ref={textarea => this.message = textarea}
            onKeyPress={this.detectEnter}/>
          <button onClick={this.clickButton} className="send-icon" type="button">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    )
  }

}

export default ChatMessages;
