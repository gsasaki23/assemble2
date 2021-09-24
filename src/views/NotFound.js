import React from "react";
import { Link } from '@reach/router';

const NotFound = (props) => {  
    return(
        <>
            <div>Error: Page at {props.location.href} was not found.</div>
            <Link to="/">Let's head back to base.</Link>
        </>
    )
}

export default NotFound;