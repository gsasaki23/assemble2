import './App.css';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyBQLB16rt3W4N3uljV_x2wR1L6GVWX388k",
  authDomain: "assemble2-b630f.firebaseapp.com",
  projectId: "assemble2-b630f",
  storageBucket: "assemble2-b630f.appspot.com",
  messagingSenderId: "1040474124604",
  appId: "1:1040474124604:web:b5a23c8e08570692c3ae39",
  measurementId: "G-0ZSWJE6P62"
});
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Firestore
let unsubscribe;

export default () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [userToken, setUserToken] = useState("");
  const [userCredential, setUserCredential] = useState({});

  // Check Login
  useEffect(()=>{
    
  },[]);

  // Sign In Button Listener
  const onSignInButtonClickedHandler = e => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then(result => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("credential: ");
        console.log(credential);
        setUserCredential(credential);
        
        const token = credential.accessToken;
        console.log("token: ");
        console.log(token);
        setUserToken(token);
        
        const user = result.user;
        console.log("user: ");
        console.log(user);
        setUser(user);

        setLoggedIn(true);
    }).catch(error => {
        console.log("Login Error: " + error);
    });
  }

  // Sign Out Button Listener
  const onSignOutButtonClickedHandler = e => {
    e.preventDefault();
    auth.signOut()
      .then(() => {
        setLoggedIn(false);
        setUserCredential({ });
        setUserToken("");
        setUser({ });
      })
      .catch(error => {
        console.log("Login Error: " + error);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
      </header>

      <h1>My Awesome App 🔥</h1>

      {/* Button for signing In/Out */}
      <div id="signInOutSection">
      { loggedIn 
        ? 
        <section id="whenSignedIn">
          <div id="userDetails">
            <h3>Hello {user.displayName}!</h3>
            <p>User ID: {user.uid}</p>
            <p>User Token: {userToken}</p>
            <p>Signed In Through: {userCredential.signInMethod}</p>
          </div>
          <button id="signOutBtn" className="btn btn-primary" onClick={onSignOutButtonClickedHandler}>
            Sign Out
          </button>
        </section>
        : 
        <section id="whenSignedOut">
          <button id="signInBtn" className="btn btn-primary" onClick={onSignInButtonClickedHandler}>
            Sign in with Google
          </button>
        </section>
      }
      </div>

      {/* Data Section */}
      <div id="dataSection">
      { loggedIn
        ?
        <section id="data">
          <h2>My Firestore Things</h2>
          <ul id="thingsList"></ul>
          <button id="createThing" className="btn btn-success">Create Random Thing</button>
        </section>
        : 
        <section id="noData">
        </section>
      }
      </div>
    </div>
  );
}