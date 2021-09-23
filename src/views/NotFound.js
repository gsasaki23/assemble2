import React from "react";
import { Link } from '@reach/router';

export default (props) => {  
    return(
        <>
            <div>Error: Page at {props.location.href} was not found.</div>
            <Link to="/">Let's head back to base.</Link>
        </>
    )
}
