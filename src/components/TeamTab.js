// Utility Imports
import { useEffect, useState } from 'react';
import { Timestamp, createEvent, updateEvent, getTeamDataByID } from '../util/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import Alert from '@mui/material/Alert';



const styles = (theme) => ({
    TeamTabTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black",
    },
    newButton: {
        position: 'fixed',
		bottom: 0,
		right: 0
    },
    eventsGrid:{
        margin: "5% 0% 0% 15%",
    },
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
    form:{
        margin: "5% 0% 0% 15%",
        textAlign: "center"
    },
    marginTop5: {
        marginTop: "5%"
    }
});

const TeamTab = (props) => {
    const { classes, userData, renderTeamData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [teamData, setTeamData] = useState(renderTeamData);
    const [pendingEvents, setPendingEvents] = useState(renderTeamData.events.filter(teamEvent => teamEvent.status === "pending"));
    const [completedEvents, setCompletedEvents] = useState(renderTeamData.events.filter(teamEvent => teamEvent.status === "completed"));
    const [openView, setOpenView] = useState(false);
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
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    dayjs.extend(relativeTime);

    const deleteEventHandler = e => {
        console.log(e);
        // firestore api call for deleting event
	};

    /*
        Handlers for "Create New Event" Button
    */
    const openNewHandler = () => {
        // console.log("openNewHandler");
        setButtonType('');
        setEventId("");
        setEventName("");
        setEventLocation("");
        setEventStartDateTime(new Date());
        setEventEndDateTime(new Date());
        setEventNotes("");
        setOpenNewEdit(true);
	};
    const submitHandler = e => {
        e.preventDefault();
        // console.log("submitHandler");
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
                setOpenNewEdit(false);
                setUpdateTeamDataTrigger(true);
                
            })
            .catch(() => {
                setErrors({...errors, submit: "error"})
                setSubmitLoading(false);
            })
    }
    const closeNewHandler = () => {
        setOpenNewEdit(false);
	};

    const openViewHandler = (data) => {
        console.log("openViewHandler");
        // set event info from args
        setOpenView(true);
	};
    const openEditHandler = e => {
        console.log("openEditHandler");

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

        setButtonType('Edit');
        setOpenNewEdit(true);
	};
    const editHandler = e => {
        e.preventDefault();
        // console.log("editHandler");
        if (errors.submit) {
            let newErrors = {...errors};
            delete newErrors.submit;
            setErrors(newErrors);
        } 
        setSubmitLoading(true);
        
        // Update Call
        updateEvent(teamData.id, {eventId, eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventNotes})
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
    const closeViewHandler = () => {
        console.log("closeViewHandler");
        setOpenView(false);
	};

    const timestampToDate = (timestamp) => {
        let ts = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
        return ts.toDate();
    }
    const timestampToDateDiff = (timestamp) => {
        let ts = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
        return dayjs(ts.toDate()).fromNow();
    }

    useEffect(()=>{
        console.log(`Showing TeamTab Component`);
        setUiLoading(false);
        setTeamData(renderTeamData);
        setPendingEvents(renderTeamData.events.filter(teamEvent => teamEvent.status === "pending"));
        setCompletedEvents(renderTeamData.events.filter(teamEvent => teamEvent.status === "completed"));

    }, [props, userData, renderTeamData]);
    
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
        <Container component="main">
            <CssBaseline />
            <h1 className={classes.TeamTabTop}>{teamData.teamName}</h1>

            {/* New/Edit Event Popup */}
            <Dialog open={openNewEdit} onClose={closeNewHandler}>
                {submitLoading === true
                ? (<>
                    <div>
                        {submitLoading && <CircularProgress size={125} className={classes.uiProgess} />}
                    </div>
                </>)
                : (<>
                <DialogTitle>{buttonType === 'Edit' ? 'Edit Event' : 'Create Event'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {buttonType === 'Edit' 
                            ? 'Edit your event details!'
                            : 'Assemble your team by creating a new event!'}
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12} className={classes.marginTop5}>
                            <TextField 
                                id="eventName" 
                                name="eventName" 
                                variant="outlined" 
                                fullWidth 
                                required
                                label="Event Name" 
                                defaultValue={eventName}
                                onChange={e => {
                                    if (e.target.value === ""){
                                        setErrors({...errors, eventName: "We need to know what we're assembling for!"});
                                    } else {
                                        if (errors.eventName) {
                                            let newErrors = {...errors};
                                            delete newErrors.eventName;
                                            setErrors(newErrors);
                                        } 
                                        setEventName(e.target.value);
                                    }
                                }}
                                helperText={errors.eventName} 
                                error={errors.eventName ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                id="eventLocation" 
                                name="eventLocation" 
                                variant="outlined" 
                                fullWidth 
                                required
                                label="Location" 
                                defaultValue={eventLocation}
                                onChange={e => {
                                    if (e.target.value === ""){
                                        setErrors({...errors, eventLocation: "We need to know where to assemble!"});
                                    } else {
                                        if (errors.eventLocation) {
                                            let newErrors = {...errors};
                                            delete newErrors.eventLocation;
                                            setErrors(newErrors);
                                        } 
                                        setEventLocation(e.target.value);
                                    }
                                }}
                                helperText={errors.eventLocation} 
                                error={errors.eventLocation ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                    id="eventStartDateTime" 
                                    name="eventStartDateTime" 
                                    variant="outlined" 
                                    fullWidth 
                                    required
                                    label="Starting Date & Time"
                                    value={eventStartDateTime}
                                    onChange={(newValue) => { setEventStartDateTime(newValue.toDate()); }}
                                    renderInput={(props) => <TextField {...props} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                    id="eventEndDateTime" 
                                    name="eventEndDateTime" 
                                    variant="outlined" 
                                    fullWidth 
                                    label="Ending Date & Time"
                                    value={eventEndDateTime}
                                    onChange={(newValue) => { setEventEndDateTime(newValue.toDate()); }}
                                    renderInput={(props) => <TextField {...props} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} className={classes.marginTop5}>
                            <TextField
                                id="eventNotes"
                                label="Notes (Optional)"
                                fullWidth
                                multiline
                                rows={4}
                                defaultValue={eventNotes}
                                onChange={e => {setEventNotes(e.target.value);}}
                            />
                        </Grid>

                        {/* If submit errors, show this */}
                        {errors.submit
                        ? (<Grid item xs={12} className={classes.marginTop5}>
                            <Alert severity="error">Something went wrong, please try again!</Alert>
                        </Grid>)
                        : (<></>)}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNewHandler}>
                        Cancel
                    </Button>
                    <Button onClick={buttonType === 'Edit' ? editHandler : submitHandler}  disabled={!eventName || !eventLocation || !eventStartDateTime || !eventEndDateTime }>
                        {buttonType === 'Edit' ? 'Save' : 'Submit'}
                    </Button>
                </DialogActions>
                </>)}
            </Dialog>

            {/* View Event Popup */}
            <Dialog open={openView} onClose={closeViewHandler}>

            </Dialog>


            {/* Pending/Completed Clusters */}
            <Grid className={classes.eventsGrid} container spacing={2}>
                {/* Pending Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Pending</Typography></Grid>
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
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-delete`} onClick={deleteEventHandler}>
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
                                <Button size="small" color="primary" id={`${teamEvent.eventId}-delete`}onClick={deleteEventHandler}>
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