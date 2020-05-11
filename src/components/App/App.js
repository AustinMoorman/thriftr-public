import React from 'react';
import './App.css';

import Home from '../home/home';
import Login from '../logIn/logIn';

import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvSwkP5aKgqIhubRUdI_2xYixBoshD9j0",
  authDomain: "thriftr.firebaseapp.com",
  databaseURL: "https://thriftr.firebaseio.com",
  projectId: "thriftr",
  storageBucket: "thriftr.appspot.com",
  messagingSenderId: "361385747218",
  appId: "1:361385747218:web:b1269989487bacfe8009cb",
  measurementId: "G-KF249Z8WNT"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage().ref()

class App extends React.Component {
  constructor(props) {
    super(props)
    
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
