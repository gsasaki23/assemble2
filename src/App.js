// Views and components
import { Router } from '@reach/router';
import Default from "./views/Default";
import NotFound from "./views/NotFound";
import NavbarComponent from "./components/NavbarComponent";

// Styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {
  return (
    <>
      <NavbarComponent/>

      <Container fluid>
        <Row>
          <Col>
            <Router>

              <Default path="/"/>
              <NotFound default/>

            </Router>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;