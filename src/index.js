// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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

// HTML Components
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userDetails = document.getElementById('userDetails');

const provider = new GoogleAuthProvider();

/// Sign in event handlers
window.onload = () => {
    // Sign In Button Listener
    signInBtn.onclick = () => signInWithPopup(auth, provider)
        .then(result => {
            // Google Access Token to access the Google API
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
        }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    
    // Sign Out Button Listener
    signOutBtn.onclick = () => auth.signOut();
    
    auth.onAuthStateChanged(user => {
        if (user) {
            // signed in
            whenSignedIn.hidden = false;
            whenSignedOut.hidden = true;
            userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
        } else {
            // not signed in
            whenSignedIn.hidden = true;
            whenSignedOut.hidden = false;
            userDetails.innerHTML = '';
        }
    });

}

