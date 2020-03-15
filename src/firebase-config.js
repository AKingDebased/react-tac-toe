import firebase from 'firebase'

let firebaseConfig = {
    apiKey: "AIzaSyDlc0O8-HyoTnrj1fR2A3OkOfPhpiM_9qg",
    authDomain: "react-tac-toe-eb1e6.firebaseapp.com",
    databaseURL: "https://react-tac-toe-eb1e6.firebaseio.com",
    projectId: "react-tac-toe-eb1e6",
    storageBucket: "react-tac-toe-eb1e6.appspot.com",
    messagingSenderId: "328420634188",
    appId: "1:328420634188:web:712a694648a80179d2cee9",
    measurementId: "G-5LD29GXS5T"
  };

let firebaseExport = firebase.initializeApp(firebaseConfig);

export default firebaseExport;