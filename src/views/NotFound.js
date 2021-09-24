import React from "react";

// Styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

const NotFound = (props) => {  
    return(
        <>
            <Alert variant="danger" style={{marginTop: "2%"}} >
                <Alert.Heading>Oops!</Alert.Heading>
                <hr />
                <p className="mb-0">
                    We're sorry, the page at {props.location.href} was not found.
                </p>
                <p className="mb-0">
                    Please return Home from the Navigation at the top!
                </p>
            </Alert>
        </>
    )
}

export default NotFound;