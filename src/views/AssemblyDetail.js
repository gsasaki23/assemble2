import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import { FaClock, FaCalendarWeek, FaMapMarkedAlt, FaInfoCircle } from "react-icons/fa";

export default (props) => {
    // Main Assembly from DB
    const [assembly, setAssembly] = useState([]);
    // Lists of teammate objects
    const [going, setGoing] = useState([]);
    const [cantgo, setCantgo] = useState([]);
    const [undecided, setUndecided] = useState([]);
    // Str after being formatted with moment
    const [dateStr, setDateStr] = useState("");
    const [timeStr, setTimeStr] = useState("");
    // Str after being formatted for ghetto Google Maps call
    const [gmapsStr, setGmapsStr] = useState("")
    // Helpers to render loading or error msg
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    // Keep track of inputs
    const [secretCodeInput, setSecretCodeInput] = useState('');
    const [inputTeammate, setInputTeammate] = useState({});
    const [teammateErrors, setTeammateErrors] = useState({});

    // Initial Load: get assembly info given ID
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/assembly/${props.id}`)
            .then(res => {
                if (res.data !== null){
                    setAssembly(res.data);

                    setLoaded(true);
                    let goingList = res.data.team.filter(teammate => teammate.status === "Going").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1);
                    setGoing(goingList);
                    let cantgoList = res.data.team.filter(teammate => teammate.status === "Can't Go").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1)
                    setCantgo(cantgoList);
                    let undecidedList = res.data.team.filter(teammate => teammate.status === "Undecided").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1);
                    setUndecided(undecidedList);

                    setDateStr(moment(res.data.date + " " + res.data.start).format("ddd, MMMM Do, YYYY"))
                    setTimeStr(
                        moment(res.data.date + " " + res.data.start).format("h:mm a") 
                        + " ~ " + 
                        moment(res.data.date + " " + res.data.end).format("h:mm a")
                    )

                    setGmapsStr(`https://www.google.com/maps/search/` + `${res.data.address.street}+${res.data.address.city}+${res.data.address.state}+${res.data.address.zip}`.replace(/\s+/g,"+"))
                }
                else{
                    setError(`Error: Event with ID ${props.id} was not found.`);
                    setLoaded(true);
                }
            })
            .catch(console.log);
    },[props])

    // Listener for secret code input
    const onSecretCodeChange = event => {
        setSecretCodeInput(event.target.value.toUpperCase());
    }
    // Listener for name input
    const onNameChange = event => {
        setInputTeammate({...inputTeammate,"name":event.target.value});
        // input len checks
        if (event.target.value.length === 0){
            setTeammateErrors({...teammateErrors, "nameZero":"Name is required.","nameLen":""})
        }
        else if (event.target.value.length < 2){
            setTeammateErrors({...teammateErrors, "nameZero":"", "nameLen":"Name must be at least 2 characters."})
        }
        else {
            setTeammateErrors({...teammateErrors, "nameZero":"", "nameLen":""})
        }
        // uniqueness checks
        let unique = true;
        for (const teammate of assembly.team){
            if (event.target.value === teammate.name){
                setTeammateErrors({...teammateErrors, "nameUnique":"This name is already listed."})
                unique = false;
            }
        }
        if (unique){
            setTeammateErrors({...teammateErrors, "nameUnique":""})
        }
    }
    // Listener for email input
    // TODO: client-side email validation
    const onEmailChange = event => {
        setInputTeammate({...inputTeammate,"email":event.target.value});
    }
    // On Teammate submit
    const onSubmitHandler = (e,str) => {
        e.preventDefault();
        
        axios.put(`http://localhost:8000/api/assembly/update/${assembly._id}/addTeammate/`, {
            ...inputTeammate, "status":str
        })
            .then(res => {
                document.getElementById("teammateForm").reset();
                navigate(`/assemblies/${res.data._id}`);
            })
            .catch(err=>{
                console.log(err.response.data);
                if (err.response.data){
                    setTeammateErrors({...teammateErrors, "server":"Please check your inputs and try again. \nName must be at least 2 characters, and Email must be in the correct format."})
                }
            })
    }

    // Confirms deleting assembly, calling deleteAssembly if 'Yes' clicked
    const confirmPopup = (event,assembly) => {
        confirmAlert({
            title: 'Warning',
            message: `Are you sure you want to delete "${assembly.name}"? This cannot be undone.`,
            buttons: [
                {label: 'Yes',onClick: () => deleteAssembly(assembly._id)},
                {label: 'No'}
            ]
        });
    }
    // Given ID, delete and jump back home
    const deleteAssembly = (assemblyID) => {   
        axios.delete('http://localhost:8000/api/assembly/delete/' + assemblyID)
            .then(navigate("/"))
            .catch(console.log)
    }

    

    return (
    <>
    {loaded && error === ""
    ? <div className="background">
        
        {/* Name and Codes */}
        <Row className="subHeader">
            <Col>
                {/* Name */}
                <h1 className="px-4">{assembly.name}</h1>
            </Col>
            <Col className="ta-r">
                {/* Code */}
                <h5>{`Event Code:`}</h5>
                <h4>{`[${assembly.eventCode}]`}</h4>
            </Col>
        </Row>

        {/* Location, Date, Time, Description*/}
        <Row className="desc">
            <Col>
                {/* Location */}
                <Row className="px-3">
                    <Col>
                        <div className="d-ilb va-t">
                            <FaMapMarkedAlt className="icon"/>
                        </div>
                        <div className="d-ilb">
                            <h4 className="descChildB">{assembly.address.name}</h4>
                            <h5 className="descChildB">{assembly.address.street}</h5>
                            <h5 className="descChildB">{`${assembly.address.city}, ${assembly.address.state} ${assembly.address.zip}`}</h5>
                            <a id="link" className="descChildB" href={gmapsStr} target="_blank" rel="noopener noreferrer">See on Google Maps</a>
                        </div>
                    </Col>
                </Row>
                {/* Date */}
                <Row className="px-3">
                    <Col>
                        <FaCalendarWeek className="icon"/>
                        <h5 className="descChildI">{dateStr}</h5>
                    </Col>
                </Row>
                {/* Time */}
                <Row className="px-3">
                    <Col>
                        <FaClock className="icon"/>
                        <h5 className="descChildI">{timeStr}</h5>
                    </Col>
                </Row>
                {/* Description */}
                <Row className="px-3">
                    <Col>
                        <FaInfoCircle className="icon"/>
                        <h4 className="descChildI">{assembly.description !== "" ? assembly.description : "None"}</h4>
                    </Col>
                </Row>
            </Col>
        </Row>

        {/* Teammate List */}
        <Row className="teammates"><Col>
            <Tabs defaultActiveKey="going">
                {/* If no teammates in list, then show 'no one' msg. 
                Else, reduce it into one string with commas in between. 
                The tricky parts are that we're reducing over [obj] instead of [str], and the first idx has to be without a leading comma.*/}
                <Tab eventKey="going" title="Going">
                    {going.length!==0 ? <h3 className="navContent">{going.reduce(function(prevVal,currVal,idx){return idx === 0 ? currVal.name : prevVal + ', ' + currVal.name;}, '')}</h3>: <h3 className="noContent">No one to show!</h3>}
                </Tab>
                <Tab eventKey="undecided" title="Undecided">
                    {undecided.length!==0 ? <h3 className="navContent">{undecided.reduce(function(prevVal,currVal,idx){return idx === 0 ? currVal.name : prevVal + ', ' + currVal.name;}, '')}</h3> : <h3 className="noContent">No one to show!</h3>}
                </Tab>
                <Tab eventKey="cantgo" title="Can't Go">
                    {cantgo.length!==0 ? <h3 className="navContent">{cantgo.reduce(function(prevVal,currVal,idx){return idx === 0 ? currVal.name : prevVal + ', ' + currVal.name;}, '')}</h3> : <h3 className="noContent">No one to show!</h3>}
                </Tab>
            </Tabs>
        </Col></Row>

        {/* Teammates Input */}
        <Row className = "teammatesInput"><Col><form id="teammateForm">
            <Row><Col><h3>Mark your attendance!</h3></Col></Row>
            {/* Name and Email Input */}
            <Row>
                <Col>
                    <div>
                        <h5>Your Name:</h5>
                        <input className="w-75p my-1" type="text" placeholder="ex: Thor" onChange={onNameChange}  autoFocus></input>
                    </div>
                </Col>
                <Col>
                    <div>
                        <h5>Email:</h5>
                        <input className="w-75p my-1" type="email" placeholder="ex: thor.odinson@gmail.com" onChange={onEmailChange}></input>
                    </div>
                </Col>
            </Row>
            {/* Pseudo-submit buttons */}
            <Row>
                <Col>
                    <div>
                        <h5>Status:</h5>
                        <Button className="w-15p d-ilb" variant="success" disabled={teammateErrors.nameZero || teammateErrors.nameLen || teammateErrors.nameUnique ? true : false} onClick={event=>onSubmitHandler(event,"Going")}>Going</Button>
                        <Button className="w-15p mx-2 d-ilb" variant="danger" disabled={teammateErrors.nameZero || teammateErrors.nameLen || teammateErrors.nameUnique ? true : false} onClick={event=>onSubmitHandler(event,"Can't Go")}>Can't Go</Button>
                    </div>
                    <div>
                        {teammateErrors.server ? <h5 className="serverValError">{teammateErrors.server}</h5> :""}
                        {teammateErrors.nameZero ? <h5 className="serverValError">{teammateErrors.nameZero}</h5> :""}
                        {teammateErrors.nameLen ? <h5 className="serverValError">{teammateErrors.nameLen}</h5> :""}
                        {teammateErrors.nameUnique ? <h5 className="serverValError">{teammateErrors.nameUnique}</h5> :""}
                    </div>
                </Col>
            </Row>
        </form></Col></Row>

        {/* Edit/Delete Section */}
        <Row className = "editDelete">
            <Col>
                <h5>Enter SECRET CODE to edit info or delete event:</h5>
                <input className="w-50p" type="text" placeholder="ex: SECRETCODE" onChange={onSecretCodeChange}></input>
                <div>
                    <Button className="w-25p" disabled={secretCodeInput === assembly.secretCode ? false : true} variant="warning" onClick={event=>navigate(`/assemblies/${props.id}/edit`)}>Edit Event</Button>
                    <Button className="w-25p" disabled={secretCodeInput === assembly.secretCode ? false : true} variant="danger" onClick={event => confirmPopup(event,assembly)}>Delete Event</Button>
                </div>
            </Col>
        </Row>

        <h3 className="production">(Production) Secret Code: {assembly.secretCode}</h3>

    </div>

    : loaded && error !== ""
    ? <Row className="px-3"><Col><h2>{`Error: Event with ID ${props.id} was not found.`}</h2><h2>Please try again, or make it yourself <span><Link to="/new">here</Link></span>!</h2></Col></Row>
    : <Row className="px-3"><Col><h2>Loading...</h2></Col></Row>
    }
    </>
)};