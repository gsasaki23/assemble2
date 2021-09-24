import { useEffect, useState } from 'react'
// import { navigate } from '@reach/router';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore, collection, getDocs, query, where, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Your web app's Firebase configuration
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
  // const db = getFirestore();

const Default = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [userToken, setUserToken] = useState("");
    const [userCredential, setUserCredential] = useState({});
    
    // Initial Effect when this page is reached!
    useEffect(()=>{
        console.log("Showing DEFAULT Component");
    },[]);

    // EMAIL Sign In Button Listener
    const onEmailSignInButtonClickedHandler = e => {
        e.preventDefault();
        window.alert("Pretend like you're logging with email lmao");
    }
    
    // GOOGLE Sign In Button Listener
    const onGoogleSignInButtonClickedHandler = e => {
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

    // Call this to navigate user to a different page
    // navigate(`/assemblies/${assemblies[assembly]._id}`);

    return (
    <div>
        {/* Button for signing In/Out */}
        <Row id="signInOutSection"><Col>
        { loggedIn 
        ? 
        <Row id="whenSignedIn">
            <Col id="userDetails">
                <h3>Hello {user.displayName}!</h3>
                <p>User Token: {userToken}</p>
                <p>User signed in through: {userCredential.signInMethod}</p>
            </Col>
            <Col>
                <Button id="signOutBtn" className="btn btn-primary" onClick={onSignOutButtonClickedHandler}>
                    Sign Out
                </Button>
            </Col>
        </Row>
        : 
        <Row id="whenSignedOut">
            <Col>
                <Button id="signInBtnEmail" className="btn btn-primary" onClick={onEmailSignInButtonClickedHandler}>
                    Sign in with Email
                </Button>
                <Button id="signInBtnGoogle" className="btn btn-primary" onClick={onGoogleSignInButtonClickedHandler}>
                    Sign in with Google
                </Button>
            </Col>
        </Row>
        }
        </Col>
        </Row>

        {/* Data Section */}
        <div id="dataSection">
        { loggedIn
        ?
        <section id="data">
            <h2>My Firestore Things</h2>
            <ul id="thingsList"></ul>
            <Button id="createThing" className="btn btn-success">Create Random Thing</Button>
        </section>
        : 
        <section id="noData">
        </section>
        }
        </div>
    </div>
)};

export default Default;