// Views and components
import { Router } from '@reach/router';
import Default from "./views/Default";
import NotFound from "./views/NotFound";

// Styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand className="navbar-margin" href="/">Assemble2 🔥</Navbar.Brand>
        <Nav className="navbar-margin">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/new">New</Nav.Link>
        </Nav>
        <Navbar.Brand className="navbar-margin" style={{fontSize: "medium"}} href="https://github.com/gsasaki23" target="_blank" rel="noopener noreferrer">© 2021 by Gaku Sasaki</Navbar.Brand>
      </Navbar>

      <Row>
        <Col>
          <Router>

            <Default path="/"/>
            <NotFound default/>

          </Router>
        </Col>
      </Row>      
    </>
  );
};

export default App;