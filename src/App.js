import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <h1>My Awesome App 🔥</h1>

      <section id="whenSignedOut">
        <button id="signInBtn" className="btn btn-primary">Sign in with Google</button>
      </section>

      <section id="whenSignedIn" hidden={true}>
        <div id="userDetails"></div>
        <button id="signOutBtn" className="btn btn-primary">Sign Out</button>
      </section>

      <section>
        <h2>My Firestore Things</h2>
        <ul id="thingsList"></ul>
        <button id="createThing" className="btn btn-success">Create Random Thing</button>
      </section>
    </div>
  );
}

export default App;