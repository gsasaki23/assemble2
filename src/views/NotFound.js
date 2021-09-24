import { navigate } from '@reach/router';

// Styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const NotFound = (props) => {  
    return(
        <>
            <Alert variant="danger" style={{marginTop: "2%"}} >
                <Alert.Heading>Oops!</Alert.Heading>
                <hr />
                <p className="mb-0">
                    We're sorry, the page at {props.location.href} was not found.
                </p>
                <Button variant="success" onClick={event=>navigate("/")}>Return to Home!</Button>
            </Alert>
        </>
    )
}

export default NotFound;