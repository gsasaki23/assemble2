import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


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

/// Sign in event handlers
window.onload = () => {
    // HTML Components
    const whenSignedIn = document.getElementById('whenSignedIn');
    const whenSignedOut = document.getElementById('whenSignedOut');
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const userDetails = document.getElementById('userDetails');
    const createThing = document.getElementById('createThing');
    const thingsList = document.getElementById('thingsList');
    
    // Sign In Button Listener
    signInBtn.onclick = () => signInWithPopup(auth, provider)
        .then(result => {
            // Google Access Token to access the Google API
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("credential: " + credential);
            console.log("token: " + token);
            console.log("user: " + user);
        }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log("errorCode: " + errorCode);
            console.log("errorMessage: " + errorMessage);
            console.log("email: " + email);
            console.log("credential: " + credential);
        });
    
    // Sign Out Button Listener
    signOutBtn.onclick = () => auth.signOut();
    
    // Listener for Sign In/Out Sections
    auth.onAuthStateChanged(async (user) => {
        // Signed In
        if (user) {
            // HTML Changes
            whenSignedIn.hidden = false;
            whenSignedOut.hidden = true;
            userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

            // Create Button Listener
            createThing.onclick = async () => {
                try {
                    const thingsRef = await addDoc(collection(db, "things"), {
                        uid: user.uid,
                        name: "TEST TEST",
                        // name: faker.commerce.productName(),
                        createdAt: serverTimestamp()
                    });
                    console.log("Document written with ID: ", thingsRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }

            // Query to retrieve all documents in "things" collection?
            const querySnapshot = await getDocs(collection(db, "things"));
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
            
            // Listener for all documents where uid = logged-in user
            const q = query(collection(db, "things"), where("uid", "==", user.uid));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                // Update HTML
                const items = [];
                querySnapshot.forEach((doc) => {
                    items.push(`<li>${doc.id + " " + doc.data().name}</li>`);
                });
                thingsList.innerHTML = items.join('');

                // Tracking Changes between snapshots
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("New thing: ", change.doc.data());
                    }
                    if (change.type === "modified") {
                        console.log("Modified thing: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("Removed thing: ", change.doc.data());
                    }
                });
            });
        } 
        // Signed Out
        else {
            // HTML Changes
            whenSignedIn.hidden = true;
            whenSignedOut.hidden = false;
            userDetails.innerHTML = '';

            // Unsubscribe from Firestore Realtime Stream
            unsubscribe && unsubscribe();
        }
    });

}

