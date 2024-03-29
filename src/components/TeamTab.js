// Utility Imports
import { useEffect, useState } from 'react';
import { Timestamp, createEvent, updateEvent, deleteEvent, getTeamDataByID } from '../util/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Component Imports
import NewEditPopup from '../components/NewEditPopup';
import ViewPopup from '../components/ViewPopup';
import DeletePopup from '../components/DeletePopup';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';

const styles = (theme) => ({
    teamName:{
        textAlign: "center",
        textDecoration: "underline",
    },
    newButton: {
        position: 'fixed',
		bottom: 0,
		right: 0
    },
	pos: {
		marginBottom: 12
	},
    marginTop5: {
        marginTop: "5%"
    },
    verticalParent: {
        position: "relative",
    },
    verticalChild: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)"
    },
    uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
    center: {
        textAlign: "center"
    }
});

const TeamTab = (props) => {
    const { classes, userData, renderTeamData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [teamData, setTeamData] = useState(renderTeamData);
    const [pendingEvents, setPendingEvents] = useState(renderTeamData.events.filter(teamEvent => teamEvent.status === "pending"));
    const [completedEvents, setCompletedEvents] = useState(renderTeamData.events.filter(teamEvent => teamEvent.status === "completed"));
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [updateTeamDataTrigger, setUpdateTeamDataTrigger] = useState(false);
    const [buttonType, setButtonType] = useState('');
    // New/Edit Event Form States
    const [openNewEdit, setOpenNewEdit] = useState(false);
    const [eventId, setEventId] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventStartDateTime, setEventStartDateTime] = useState(new Date());
    const [eventEndDateTime, setEventEndDateTime] = useState(new Date());
    const [eventNotes, setEventNotes] = useState("");
    const [eventStatus, setEventStatus] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    dayjs.extend(relativeTime);

    /*
        Handlers for "Create New Event" Button
    */
    const openNewHandler = () => {
        setButtonType('');
        setEventId("");
        setEventName("");
        setEventLocation("");
        setEventStartDateTime(new Date());
        setEventEndDateTime(new Date());
        setEventNotes("");
        setEventStatus(false);
        setOpenNewEdit(true);
	};
    const createNewHandler = e => {
        e.preventDefault();
        if (errors.submit) {
            let newErrors = {...errors};
            delete newErrors.submit;
            setErrors(newErrors);
        } 
        setSubmitLoading(true);
        createEvent(teamData.id, {eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventNotes})
            .then(() => {
                // Alert?
                setSubmitLoading(false);
                setEventName("");
                setEventLocation("");
                setEventStartDateTime(new Date());
                setEventEndDateTime(new Date());
                setEventNotes("");
                setEventStatus(false);
                setOpenNewEdit(false);
                setUpdateTeamDataTrigger(true);
                
            })
            .catch(() => {
                setErrors({...errors, submit: "error"})
                setSubmitLoading(false);
            })
    }
    const closeNewEditHandler = () => {
        setOpenNewEdit(false);
	};

    /*
        Handlers for Event "EDIT" Button
    */
    const openEditHandler = e => {
        e.preventDefault();

        // Find matching event ID
        let eventIdToEdit = parseInt(e.target.id.replaceAll("-edit",""));
        let eventToEdit = {};
        for (const event of teamData.events) {
            if (event.eventId === eventIdToEdit) {
                eventToEdit = event;
                break;
            } 
        }
        // TODO: Error handling
        if (eventToEdit === {}) return;

        // Set respective field into state
        setEventId(eventToEdit.eventId);
        setEventName(eventToEdit.eventName);
        setEventLocation(eventToEdit.location);
        setEventStartDateTime(timestampToDate(eventToEdit.startDateTime));
        setEventEndDateTime(timestampToDate(eventToEdit.endDateTime));
        setEventNotes(eventToEdit.notes);
        eventToEdit.status === "completed" 
        ? setEventStatus(true)
        : setEventStatus(false);

        setButtonType('Edit');
        setOpenNewEdit(true);
    };
    const editHandler = e => {
        e.preventDefault();

        // Error Handling
        if (errors.submit) {
            let newErrors = {...errors};
            delete newErrors.submit;
            setErrors(newErrors);
        } 
        setSubmitLoading(true);
        
        // Update Call
        let eventStatusToSubmit = eventStatus === true ? "completed" : "pending";
        updateEvent(teamData.id, {eventId, eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventNotes, eventStatusToSubmit})
            .then(() => {
                // Alert?
                setSubmitLoading(false);
                setOpenNewEdit(false);
                setUpdateTeamDataTrigger(true);
                
            })
            .catch(() => {
                setErrors({...errors, submit: "error"})
                setSubmitLoading(false);
            })
    }
    // Handler for CANCEL is above.

    /*
        Handlers for Event "VIEW" Button
    */
    const openViewHandler = e => {
        e.preventDefault();

        // Find matching event ID
        let eventIdToShow = parseInt(e.target.id.replaceAll("-view",""));
        let eventToView = {};
        for (const event of teamData.events) {
            if (event.eventId === eventIdToShow) {
                eventToView = event;
                break;
            } 
        }
        // TODO: Error handling
        if (eventToView === {}) return;

        // Set respective field into state
        setEventId(eventToView.eventId);
        setEventName(eventToView.eventName);
        setEventLocation(eventToView.location);
        setEventStartDateTime(timestampToDate(eventToView.startDateTime));
        setEventEndDateTime(timestampToDate(eventToView.endDateTime));
        setEventNotes(eventToView.notes);
        eventToView.status === "completed" 
        ? setEventStatus(true)
        : setEventStatus(false);

        setOpenView(true);
	};
    const closeViewHandler = () => {
        console.log("closeViewHandler");
        setOpenView(false);
	};

    /*
        Handlers for Event "DELETE" Button
    */
    const openDeleteHandler = e => {
        e.preventDefault();

        // Find matching event ID
        let eventIdToDelete = parseInt(e.target.id.replaceAll("-delete",""));
        let eventToDelete = {};
        for (const event of teamData.events) {
            if (event.eventId === eventIdToDelete) {
                eventToDelete = event;
                break;
            } 
        }
        // TODO: Error handling
        if (eventToDelete === {}) return;

        // Set respective field into state
        setEventId(eventToDelete.eventId);
        setEventName(eventToDelete.eventName);

        setButtonType('Delete');
        setOpenDelete(true);    
    };
    const deleteEventHandler = e => {
        e.preventDefault();

        // Delete Call
        deleteEvent(teamData.id, eventId)
            .then(() => {
                // Alert?
                setSubmitLoading(false);
                setOpenDelete(false);
                setUpdateTeamDataTrigger(true);
            })
            .catch(() => {
                setErrors({...errors, submit: "error"})
                setSubmitLoading(false);
            })
	};
    const closeDeleteHandler = () => {
        setOpenDelete(false);
    }

    // Helpers
    const timestampToDate = (timestamp) => {
        let ts = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
        return ts.toDate();
    }
    const timestampToDateDiff = (timestamp) => {
        let ts = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
        return dayjs(ts.toDate()).fromNow();
    }

    // TeamTab Updated
    useEffect(()=>{
        console.log(`Showing TeamTab Component`);
        setUiLoading(false);
        setTeamData(renderTeamData);
        setPendingEvents(renderTeamData.events.filter(teamEvent => teamEvent.status === "pending"));
        setCompletedEvents(renderTeamData.events.filter(teamEvent => teamEvent.status === "completed"));

    }, [props, userData, renderTeamData]);
    
    // TeamData Updated
    useEffect(()=>{
        if (updateTeamDataTrigger === true) {
            getTeamDataByID(teamData.id)
            .then((res) => {
                if (res.teamDocument) {
                    // console.log(res.teamDocument);
                    setTeamData(res.teamDocument);
                    setPendingEvents(res.teamDocument.events.filter(teamEvent => teamEvent.status === "pending"));
                    setCompletedEvents(res.teamDocument.events.filter(teamEvent => teamEvent.status === "completed"));
                } 
            })
            .catch(() => {
                window.alert("TeamTab.js: No Team ID match.");
            })
            setUpdateTeamDataTrigger(false);
        }
        // eslint-disable-next-line
    }, [ updateTeamDataTrigger ]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Typography variant="h3" mt={"7%"} className={classes.teamName}>Team {teamData.teamName}</Typography>

            {/* New/Edit Event Popup */}
            <Dialog open={openNewEdit} onClose={closeNewEditHandler}>
                {submitLoading === true
                ? (<>
                    {submitLoading && <CircularProgress size={125} className={classes.uiProgess} />}
                </>)
                : ( <NewEditPopup 
                        buttonType = { buttonType }
                        errors = { errors } setErrors = { setErrors }
                        eventName = { eventName } setEventName = { setEventName }
                        eventLocation = { eventLocation } setEventLocation = { setEventLocation }
                        eventStartDateTime = { eventStartDateTime } setEventStartDateTime = { setEventStartDateTime }
                        eventEndDateTime = { eventEndDateTime } setEventEndDateTime = { setEventEndDateTime }
                        eventNotes = { eventNotes } setEventNotes = { setEventNotes }
                        eventStatus = { eventStatus } setEventStatus = { setEventStatus }
                        closeNewEditHandler = { closeNewEditHandler }
                        createNewHandler = { createNewHandler }
                        editHandler = { editHandler }
                /> )}
            </Dialog>

            {/* View Event Popup */}
            <Dialog open={openView} onClose={closeViewHandler}>
                <ViewPopup 
                    eventName = { eventName }
                    eventLocation = { eventLocation } setEventLocation = { setEventLocation }
                    eventStartDateTime = { eventStartDateTime } setEventStartDateTime = { setEventStartDateTime }
                    eventEndDateTime = { eventEndDateTime } setEventEndDateTime = { setEventEndDateTime }
                    eventNotes = { eventNotes } setEventNotes = { setEventNotes }
                    eventStatus = { eventStatus } setEventStatus = { setEventStatus }
                    closeViewHandler = { closeViewHandler }
                />
            </Dialog>
            
            {/* Delete Event Popup */}
            <Dialog open={openDelete} onClose={closeDeleteHandler}>
                {submitLoading === true
                ? (<>
                    <div>
                        {submitLoading && <CircularProgress size={125} className={classes.uiProgess} />}
                    </div>
                </>)
                : (
                    <DeletePopup 
                        eventName={eventName} 
                        deleteEventHandler={deleteEventHandler} 
                        closeDeleteHandler={closeDeleteHandler}
                    />   
                )}
            </Dialog>

            {/* Pending/Completed Clusters */}
            <Grid className={classes.marginTop5} container spacing={2} >
                {/* Pending Cluster */}
                <Grid item xs={12} ><Typography variant="h5" component="h2">Pending</Typography></Grid>
                { pendingEvents.map((teamEvent,i) => 
                    (<Grid item xs={12} sm={4} key={i} >
                        <Card className={classes.eventCard} variant="outlined">
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {teamEvent.eventName}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    Created {timestampToDateDiff(teamEvent.createdAt)}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    at {teamEvent.location}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-view`} onClick={openViewHandler}>
                                    View
                                </Button>
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-edit`} onClick={openEditHandler}>
                                    Edit
                                </Button>
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-delete`} onClick={openDeleteHandler}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>)
                )}  {/* End Pending */}

                {/* Completed Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Completed</Typography></Grid>
                { completedEvents.map((teamEvent,i) => 
                    (<Grid item xs={12} sm={4} key={i} >
                        <Card className={classes.eventCard} variant="outlined">
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {teamEvent.eventName}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    Created {timestampToDateDiff(teamEvent.createdAt)}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    at {teamEvent.location}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-view`} onClick={openViewHandler}>
                                    View
                                </Button>
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-edit`} onClick={openEditHandler}>
                                    Edit
                                </Button>
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-delete`}onClick={openDeleteHandler}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>)
                )}  {/* End Completed */}
            </Grid>

            {/* New Event Button */}
            <IconButton color="primary" aria-label="Create Event" onClick={openNewHandler}> 
                <AddCircleIcon style={{ fontSize: 60 }} className={classes.newButton} /> 
            </IconButton>
        </Container>
    </>
    );
};

export default withStyles(styles)(TeamTab);