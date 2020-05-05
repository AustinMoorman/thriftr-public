import React from 'react';
import './offers.css';

class Offers extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      img: ''
    }
  }
  



  render() {
    return (
      <div>
      <h1>thriftr Offers</h1>
      <img src='https://firebasestorage.googleapis.com/v0/b/thriftr.appspot.com/o/download.jpg?alt=media&token=19d6ce4c-d167-4d23-a322-935d7575f88d' />
      </div>

    )
  }
}

export default Offers;