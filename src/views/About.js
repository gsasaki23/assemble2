import React from 'react'
import { navigate } from '@reach/router';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default () => {
    return (
    <div className="background">
    {/* Page Title */}
    <Row className="editHeading mx-auto"><Col>
        <h1>About</h1>
    </Col></Row>

    {/* Block One */}
    <Row className="blockOne mx-auto"><Col>
        <h4 className="aboutA">What is this? </h4>
        <h3 className="aboutC">A Web-App to help <span className="assembleTitle">Assemble</span> your team!</h3>

        <h4 className="aboutA">Features: </h4>
        <h3 className="aboutB">No login required! Most features are accessible through the Event Code.</h3>
        <h3 className="aboutB">Easily share the event through one-click invite links.</h3>
        <h3 className="aboutC">See who else has already responded.</h3>

        <h5 className="aboutA">Note: Conceptually designed and built for one-way availability checking.<br />This means a "who can show up to the dodgeball game next week?" is better suited than organizing an Area 51 raid.</h5>
        <h5 className="aboutA">Check out this project on <span><a href="https://github.com/gsasaki23/assemble_project" target="_blank" rel="noopener noreferrer">Github</a></span>!</h5>
        <h5 className="aboutA">Built on the MERN stack with lots of tears, sweat, and blood... during the 2020 self-quarantine.</h5>


    </Col></Row>

    {/* New Jumper */}
    <Row className="blockTwo mx-auto"><Col>
        <h3 className="">Try it out yourself:</h3>
        <Button className="newJumpButton" variant="success" onClick={event=>navigate("/new")}>Assemble!</Button>
    </Col></Row>
    </div>
)};