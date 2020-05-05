import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
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