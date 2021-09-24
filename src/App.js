// Views and components
import { Router } from '@reach/router';
import NotFound from "./views/NotFound";
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';

// Styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Styling
// import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
// import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
// const theme = createTheme ({
//   palette: {
// 		primary: {
// 			light: '#33c9dc',
// 			main: '#FF5722',
// 			dark: '#d50000',
// 			contrastText: '#fff'
// 		}
//   }
// })
      
// TODO: import createTheme  from '@material-ui/core/styles';


const App = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Router>

              <Home path="/"/>
              <Signin path="/signin"/>
              <Signup path="/signup"/>
              <NotFound default/>

            </Router>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;