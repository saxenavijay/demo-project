import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/analytics'

// Add your Firebase credentials

  class Firebase {
    constructor() {
      firebase.initializeApp({
        apiKey: "AIzaSyBZaFOx1IwbNFTkO1ZT-jkDNcHdT0fBszY",
        authDomain: "bulky-marketing.firebaseapp.com",
        databaseURL: "https://bulky-marketing-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "bulky-marketing",
        storageBucket: "bulky-marketing.appspot.com",
        messagingSenderId: "279265001159",
        appId: "1:279265001159:web:bf7bdf994e232514de48e2",
        measurementId: "G-EV99CMD98F"
      });
      this.firebase = firebase;
      this.firestore = firebase.firestore();
      this.auth = firebase.auth();
    }
  };

  export default Firebase;  