import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { navigate } from '@reach/router';
import randomWords from 'random-words';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// make name, secretcode, and eventcode unique

export default () => {
    // All Assemblies in DB
    const [assemblies, setAssemblies] = useState([]);

    // PreFill Section: Hide input or not
    const [hideDupeInput, setHideDupeInput] = useState(true);
    const [dupeAssembly, setDupeAssembly] = useState(null);
    const [hideCopiedMsg, setHideCopiedMsg] = useState(true);

    // The Assembly being built out of inputs
    const [inputAssembly, setInputAssembly] = useState({"address":{}});
    // Server-side validation errors
    const [errors, setErrors] = useState([]);
    // Client-side validation errors
    const [clientErrors, setClientErrors] = useState({});
    
    // Initial: fetch all assemblies to be used for client-side validations
    useEffect(()=>{
        axios.get('http://localhost:8000/api/assembly/')
            .then(res => {
                setAssemblies(res.data);
            })
            .catch(console.log);
    },[]);
    
    // On Submit of Main Form
    const onClickHandler = e => {
        e.preventDefault();

        // Create the would-be secret code with random words
        let randomTwo = randomWords({exactly: 2, minLength: 3, maxLength: 6, formatter: (word)=> word.toUpperCase()});
        let str = randomTwo[0] + randomTwo[1];
        
        // In the absturdly small change of non-unique, try infinitely until unique?
        // make & use dbsecretcodes state, similar to dbeventcodes

        console.log("Sending to the Server, minus secretCode: " + JSON.stringify(inputAssembly));
        
        axios.post(`http://localhost:8000/api/assembly/new`, {...inputAssembly,"secretCode":str})
            .then(res => {
                navigate(`/assemblies/${res.data._id}`)
            })
            .catch(err=>{
                console.log(err.response);
                if (err.response.data.errors){
                    console.log(err.response.data.errors);
                    setErrors(err.response.data.errors)
                }
            })
    }

    // Client-side validation for uniqueness, runs any time inputAssembly.name is changed
    useEffect(()=>{
        let found = false;
        assemblies.forEach((assembly)=>{
            if(assembly.name === inputAssembly.name){
                setClientErrors({...clientErrors,"name":"Name must be unique!"});
                found = true;
            }
        })
        if(!found){
            setClientErrors({...clientErrors,"name":""});
        }
        console.log(inputAssembly.name);
    },[inputAssembly.name])

    // Client-side validation for uniqueness, runs any time inputAssembly.eventCode is changed
    useEffect(()=>{
        let found = false;
        assemblies.forEach((assembly)=>{
            if(assembly.eventCode === inputAssembly.eventCode){
                setClientErrors({...clientErrors,"eventCode":"Event Code must be unique!"});
                found = true;
            }
        })
        if(!found){
            setClientErrors({...clientErrors,"eventCode":""});
        }
    },[inputAssembly.eventCode])

    // Client-side validation for existence
    const onDupeInputChange = event => {
        // Force input to stay capitalized
        event.target.value = event.target.value.toUpperCase();

        // If code is found, enable the Copy button and set dupeAssembly state. Else disable
        let found = false;
        assemblies.forEach((assembly)=>{
            if(assembly.eventCode === event.target.value.toUpperCase()){
                found = true;
                setDupeAssembly(assembly);
            }
        })
        if (found){
            setClientErrors({...clientErrors,"dupeInput":""}) 
        }
        else {
            setClientErrors({...clientErrors,"dupeInput":"not found"});
            setDupeAssembly(null);
        }
    };
    // On Submit of Dupe Input
    const onDupeSubmit = e => {
        //e.preventDefault();

        // // WARNING: Will populate the inputs but onChange validators will not run :c
        // populate inputs in main with info of assembly with eventCode as dupeInput

        setInputAssembly({...inputAssembly,
            // name:dupeAssembly.name,
            // eventCode:dupeAssembly.eventCode,
            "address":{"name":dupeAssembly.address.name, "street":dupeAssembly.address.street, "city":dupeAssembly.address.city, "state":dupeAssembly.address.state, "zip":dupeAssembly.address.zip},
            date:dupeAssembly.date,
            start:dupeAssembly.start,
            end:dupeAssembly.end,
            description:dupeAssembly.description,
        });
        setHideCopiedMsg(false);

        // Idea: Populate with the team from original, but set everyone to "Undecided"
    };

    return (
    <div className="background">
    {/* Page Title */}
    <Row className="editHeading mx-auto"><Col>
        <h1>New Event</h1>
    </Col></Row>

    {/* Dupe Section */}
    <Row className="dupeSection"><Col>
        <Row>
            {/* PreFill Prompt */}
            <Col>
                <h5 className = "dupeOpenHead my-auto">Pre-fill with info from another event?</h5>
                {/* Unhides right Col, disable Copy button initially */}
                <Button className="dupeOpenButton my-auto" variant="warning" onClick={e => {setHideDupeInput(false);setClientErrors({...clientErrors,"dupeInput":"not found"});}}>Yes</Button>
            </Col>
            {/* PreFill Input */}
            <Col hidden={hideDupeInput ? true : false}>
                <Row>
                    <h4 className="my-auto">Copy from another Event Code:</h4>
                    <input className="w-25p d-ilb" type="text" placeholder="ex: ANOTHER" onChange={onDupeInputChange}></input>
                    <Button className="dupeSubmitButton" variant="success" disabled={clientErrors.dupeInput ? true : false} onClick={onDupeSubmit}>Copy</Button>
                    <h5 hidden={hideCopiedMsg ? true : false} className="clientValError">Copied!</h5>
                </Row>
            </Col>
        </Row>
    </Col></Row>

    {/* Name and EventCode */}
    <Row className="editTop"><Col>
        {/* Name */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Event Name:</h2></Col>
            <Col>
                <input className="w-50p d-ilb" value={inputAssembly.name} autoFocus type="text" placeholder="ex: Alien Landing" onChange={event => {setInputAssembly({...inputAssembly,"name":event.target.value});}}></input>
                {errors.name !== undefined ? (<span className="serverValError">{errors.name.message}</span>):("")}
                {clientErrors.name !== undefined ? (<span className="clientValError">{clientErrors.name}</span>):("")}
            </Col>
        </Row>
        {/* Event Code */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Event Code:</h2></Col>
            <Col>
                <input className="w-50p d-ilb" type="text" placeholder="ex: SQUIDWARD" value={inputAssembly.eventCode} onChange={event => {setInputAssembly({...inputAssembly,"eventCode":event.target.value.toUpperCase()});}}></input>
                {errors.eventCode !== undefined ? (<span className="serverValError">{errors.eventCode.message}</span>):("")}
                {clientErrors.eventCode !== undefined ? (<span className="clientValError">{clientErrors.eventCode}</span>):("")}
            </Col>
        </Row>
    </Col></Row>

    {/* Everything else */}
    <Row className="editMain mx-auto"><Col>
        {/* Location */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Location: </h2></Col>
            <Col>
                {/* Name */}
                <div>
                    <input value={inputAssembly.address.name} className="w-50p d-ilb" type="text" placeholder="ex: Sanctum Sanctorum" onChange={event => {setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"name":event.target.value}});}}></input>
                    {errors["address.name"] !== undefined ? (<span className="serverValError">{errors["address.name"].message}</span>):("")}
                </div>
                {/* Street Line */}
                <div>
                    <input value={inputAssembly.address.street} className="w-50p d-ilb" type="text" placeholder="ex: 420 69th St" onChange={event => {
                        setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"street":event.target.value}});
                    }}></input>
                    {errors["address.street"] !== undefined ? (<span className="serverValError">{errors["address.street"].message}</span>):("")}
                </div>
                {/* City, State, Zip */}
                <div>
                    <input value={inputAssembly.address.city} className="w-15p d-ilb" type="text" placeholder="ex: New York" onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"city":event.target.value}});
                    }}></input>
                    <input value={inputAssembly.address.state} className="w-15p d-ilb" type="text" placeholder="ex: NY" onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"state":event.target.value}});
                    }}></input>
                    <input value={inputAssembly.address.zip} className="w-15p d-ilb" type="text" placeholder="ex: 12345" onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"zip":event.target.value}});
                    }}></input>
                    {errors["address.city"] !== undefined ? (<span className="serverValError">{errors["address.city"].message}</span>):("")}
                    {errors["address.state"] !== undefined ? (<span className="serverValError">{errors["address.state"].message}</span>):("")}
                    {errors["address.zip"] !== undefined ? (<span className="serverValError">{errors["address.zip"].message}</span>):("")}
                </div>
            </Col>
        </Row>
        {/* Date */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Date: </h2></Col>
            <Col>
                <input value={inputAssembly.date} className="d-ilb" type="date" defaultValue="2020-01-01" onChange={event => {
                setInputAssembly({...inputAssembly,"date":event.target.value});
                }}></input>
                {errors.date !== undefined ? (<span className="serverValError">{errors.date.message}</span>):("")}
            </Col>
        </Row>
        {/* Start Time */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Start Time: </h2></Col>
            <Col>
                <input value={inputAssembly.start}  className="d-ilb" type="time" defaultValue="13:00"  onChange={event => {setInputAssembly({...inputAssembly,"start":event.target.value});}}></input>
                {errors.start !== undefined ? (<span className="serverValError">{errors.start.message}</span>):("")}
            </Col>
        </Row>
        {/* End Time */}    
        <Row className="editSubSection">
            <Col xs={3}><h2>End Time: </h2></Col>
            <Col>
                <input value={inputAssembly.end} className="d-ilb" type="time" defaultValue="14:00" onChange={event => {
                setInputAssembly({...inputAssembly,"end":event.target.value});
                }}></input>
                {errors.end !== undefined ? (<span className="serverValError">{errors.end.message}</span>):("")}
            </Col>
        </Row>
        {/* Description */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Description:</h2></Col>
            <Col>
                <textarea value={inputAssembly.description} className="w-50p d-ilb" type="text" placeholder="ex: eArtH iS CloSEd tODaY" onChange={event => {
                setInputAssembly({...inputAssembly,"description":event.target.value});
                }}></textarea>
                {errors.description !== undefined ? (<span className="serverValError">{errors.description.message}</span>):("")}
            </Col>
        </Row>
    </Col></Row>
    
    {/* ~~~~~~~~~~~~~~~~~~Teammate List Here ~~~~~~~~~~~~~~~~~ */}

    {/* Submit Button */}
    <Row className="mx-auto">
        <Button className="mx-auto editSaveButton" variant="success" disabled={clientErrors.name || clientErrors.eventCode ? true : false} onClick={onClickHandler}>Create Event</Button>
    </Row>
    </div>
)};