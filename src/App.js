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
    <Container className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Assemble2 🔥</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/new">New</Nav.Link>
        </Nav>
        <p className="text-muted">© 2021 by Gaku Sasaki</p>
      </Navbar>

      <Row>
        <Col>
          <Router>

            <Default path="/"/>
            <NotFound default/>

          </Router>
        </Col>
      </Row>      
    </Container>
  );
};

export default App;