import React from 'react';
import './App.css';

import Home from '../home/home';
import Login from '../logIn/logIn';

import firebase from "firebase/app";
import "firebase/storage";

console.log()
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "thriftr.firebaseapp.com",
  databaseURL: "https://thriftr.firebaseio.com",
  projectId: "thriftr",
  storageBucket: "thriftr.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);




class App extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount(){
    function resetHeight(){
      // reset the body height to that of the inner browser
      document.body.style.height = window.innerHeight + "px";
  }
  // reset the height whenever the window's resized
  window.addEventListener("resize", resetHeight);
  // called to initially set the height.
  resetHeight();
  }

  render() {
    return (
      <div id="main">
        <Login />
      </div>

    )
  }
}

export default App;
