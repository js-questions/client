import React, { Component } from 'react';
import './card.scss';

class Card extends Component {

  checkAvailability() {
    if (this.props.tutor.available) {
      return (<button className="button-primary" onClick={this.props.chatNow}>chat now</button>)
    } else {
      return (<button className="button-primary" disabled onClick={this.props.chatNow}>sorry offline</button>)
    }
  }

  msToTime() {
    const isoDate = this.props.offer.expiration;
    const regularDate = new Date(isoDate);
    const miliseconds = regularDate.getTime();
    const dateNow = Date.now();
    let remaining =  miliseconds - dateNow;
    if (remaining < 0)return 'EXPIRED';

    remaining = Math.abs(remaining);
    let minutes = Math.floor((remaining / (1000 * 60)) % 60);
    let hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    return hours + ":" + minutes;
  }

  expiredOrNot () {
    if (this.msToTime() !== 'EXPIRED') {
      return (
        <div className="card-action">
          {this.checkAvailability()}
          <button className="button-secondary">No thanks!</button>
        </div>
      )
    } else {
      return (
        <div className="card-action">
          <button className="button-primary" disabled>EXPIRED</button>
        </div>
      )
    }
  }

  render() {
    if (this.props.tutor) {
      return (
        <div className="card-container">
          <div className="card-avatar">
            <img src={this.props.tutor.profileBadge} alt="profile-badge" width="50px"/>
            <p>{this.props.tutor.username}</p>
          </div>
          <div className="card-body">
            <p className="expiryDate">This offer expires in: {this.msToTime()}</p>
            <h4>Message:</h4>
            <p>{this.props.offer.message}</p>
            <p className="karmaEarned">{this.props.tutor.karma} <span role="img" aria-label="karma">🙏</span> earned so far</p>
          </div>
          {this.expiredOrNot()}
        </div>
      )
    } else {
      return 'Loading...'
    }
  }
}

export default Card;

/* ------------------------------------------------------------------- 
Card component:
This component shows offer's on the user's question-posted page. 
This is where the learner can accept to join a chat with a tutor to 
chat about their question.
The offers will show as expired and disable ablility to chat with 
a tutor.
---------------------------------------------------------------------- */