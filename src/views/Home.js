import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { navigate } from '@reach/router';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default () => {
    const [assemblies, setAssemblies] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [eventCode, setEventCode] = useState('');
    const [error, setError] = useState('');
    
    // Listener for form input
    const onEventCodeChange = event => {
        // Force input to stay capitalized
        event.target.value = event.target.value.toUpperCase();
        
        setEventCode(event.target.value);
        // add char length validations as needed here
    }

    // Get all assemblies
    useEffect(()=>{
        axios.get('http://localhost:8000/api/assembly/')
            .then(res => {
                setAssemblies(res.data);
                setLoaded(true);
            })
            .catch(console.log);
    },[]);

    const onSubmitHandler = e => {
        e.preventDefault();
        for (let assembly in assemblies){                    
            if(assemblies[assembly].eventCode === eventCode.toUpperCase()){
                navigate(`/assemblies/${assemblies[assembly]._id}`);
            }
        }
        setError("No matches found. Please try another code, or start an event youself below!");
    }

    return (
    <div className="background">
    {loaded 
    ? <>
    {/* Page Title */}
    <Row className="editHeading mx-auto"><Col>
        <h1>Welcome!</h1>
    </Col></Row>

    {/* Event Code Jumper */}
    <Row className="codeJump mx-auto"><Col>
        <h3>If you already have an EVENT CODE:</h3>
        <Form onSubmit={onSubmitHandler}>
            <input autoFocus className="w-50p mt-3" id="eventCodeInput" type="text" placeholder="ex: EVENTCODE" onChange={onEventCodeChange}></input>
            <Button className="submitButton" variant="primary" type="submit">Let's Go!</Button>
            {error !== "" ? <span className="d-b">{error}</span>:("")}
        </Form>
    </Col></Row>

    {/* New Jumper */}
    <Row className="newJump mx-auto"><Col>
        <h3 className="">Assemble your team for a NEW EVENT:</h3>
        <Button className="newJumpButton" variant="success" onClick={event=>navigate("/new")}>Assemble!</Button>
    </Col></Row>

    <Row>
        <Col className="production">
            <h4>PRODUCTION - event names and codes:</h4>
            {assemblies.map((assembly,idx)=>{
                return (<p key={idx}>{`Name: ${assembly.name}, EventCode: ${assembly.eventCode}, SecretCode: ${assembly.secretCode}`}</p>)
            })}
        </Col>
    </Row>
    </> 
    : <Row className="px-3"><Col><h2>Loading...</h2></Col></Row>}
    </div>
)};