import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default (props) => {
    const [assembly, setAssembly] = useState([]);
    const [inputAssembly, setInputAssembly] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [errors, setErrors] = useState([]);
    
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/assembly/${props.id}`)
            .then(res => {
                if (res.data !== null){
                    setAssembly(res.data);
                    setInputAssembly(res.data);
                    setLoaded(true);
                }
                else{
                    setLoadError(`Error: Event with ID ${props.id} was not found.`);
                    setLoaded(true);
                }
            })
            .catch(console.log);
    },[props])

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/assembly/update/${props.id}`, inputAssembly)
            .then(res => {
                navigate(`/assemblies/${props.id}`)
            })
            .catch(err=>{
                if (err.response.data.errors){
                    console.log(err.response.data.errors);
                    setErrors(err.response.data.errors)
                }
                // check for dupes?
            })
    }

    return (
    <>
    {loaded && loadError === ""? 
    <div className="background">
    
    {/* Page Title */}
    <Row className="editHeading mx-auto"><Col>
        <h1>Editing Event</h1>
    </Col></Row>

    {/* Name and EventCode */}
    <Row className="editTop"><Col>
        {/* Name */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Event Name:</h2></Col>
            <Col>
                <input autoFocus className="w-50p d-ilb" type="text" defaultValue={assembly.name} onChange={event => {
                setInputAssembly({...inputAssembly,"name":event.target.value});
                }}></input>
                {errors.name !== undefined ? (<span className="serverValError">{errors.name.message}</span>):("")}
            </Col>
        </Row>
        {/* Event Code */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Event Code:</h2></Col>
            <Col><h3>{assembly.eventCode} (Unchangeable)</h3></Col>
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
                    <input className="w-50p d-ilb" type="text" defaultValue={assembly.address.name} onChange={event => {setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"name":event.target.value}});}}></input>
                    {errors["address.name"] !== undefined ? (<span className="serverValError">{errors["address.name"].message}</span>):("")}
                </div>
                {/* Street Line */}
                <div>
                    <input className="w-50p d-ilb" type="text" defaultValue={assembly.address.street} onChange={event => {
                        setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"street":event.target.value}});
                    }}></input>
                    {errors["address.street"] !== undefined ? (<span className="serverValError">{errors["address.street"].message}</span>):("")}
                </div>
                {/* City, State, Zip */}
                <div>
                    <input className="w-15p d-ilb" type="text" defaultValue={assembly.address.city} onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"city":event.target.value}});
                    }}></input>
                    <input className="w-15p d-ilb" type="text" defaultValue={assembly.address.state} onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"state":event.target.value}});
                    }}></input>
                    <input className="w-15p d-ilb" type="text" defaultValue={assembly.address.zip} onChange={event => {
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
                <input className="d-ilb" type="date" defaultValue={assembly.date} onChange={event => {
                setInputAssembly({...inputAssembly,"date":event.target.value});
                }}></input>
                {errors.date !== undefined ? (<span className="serverValError">{errors.date.message}</span>):("")}
            </Col>
        </Row>
        {/* Start Time */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Start Time: </h2></Col>
            <Col>
                <input className="d-ilb" type="time" value={assembly.start} onChange={event => {
                setInputAssembly({...inputAssembly,"start":event.target.value});
                }}></input>
                {errors.start !== undefined ? (<span className="serverValError">{errors.start.message}</span>):("")}
            </Col>
        </Row>
        {/* End Time */}    
        <Row className="editSubSection">
            <Col xs={3}><h2>End Time: </h2></Col>
            <Col>
                <input className="d-ilb" type="time" value={assembly.end} onChange={event => {
                setInputAssembly({...inputAssembly,"end":event.target.value});
                }}></input>
                {errors.end !== undefined ? (<span className="serverValError">{errors.end.message}</span>):("")}
            </Col>
        </Row>
        {/* Description */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Description:</h2></Col>
            <Col>
                <textarea className="w-50p d-ilb" type="text" defaultValue={assembly.description} onChange={event => {
                setInputAssembly({...inputAssembly,"description":event.target.value});
                }}></textarea>
                {errors.description !== undefined ? (<span className="serverValError">{errors.description.message}</span>):("")}
            </Col>
        </Row>
    </Col></Row>
    
    {/* Submit Button */}
    <Row className="mx-auto">
        <Button className="mx-auto editSaveButton" variant="success" onClick={onSubmitHandler}>Save Changes</Button>
    </Row>

    </div>
    : loaded && loadError !== ""
    ? <Row className="editSubSection"><Col><h2>{`Error: Event with ID ${props.id} was not found.`}</h2><h2>Please try again, or make it yourself <span><Link to="/new">here</Link></span>!</h2></Col></Row>
    : <Row className="editSubSection"><Col><h2>Loading...</h2></Col></Row>
    }
    </>
)};