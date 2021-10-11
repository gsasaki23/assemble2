// Utility Imports
import { useEffect, useState } from 'react';
import { Timestamp, createEvent, getTeamDataByID } from '../util/firestore';
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
    const [openView, setOpenView] = useState(false);
    const [buttonType, setButtonType] = useState('');
    const [updateTeamDataTrigger, setUpdateTeamDataTrigger] = useState(false);
    // New Event Form States
    const [openNew, setOpenNew] = useState(false);
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
        console.log("openNewHandler");
        setButtonType('');
        setOpenNew(true);
	};
    const submitHandler = e => {
        e.preventDefault();
        console.log("submitHandler");
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
                setOpenNew(false);
                
                setUpdateTeamDataTrigger(true);
            })
            .catch(() => {
                setErrors({...errors, submit: "error"})
                setSubmitLoading(false);
            })
    }
    const closeNewHandler = () => {
        setOpenNew(false);
	};

    const openViewHandler = (data) => {
        console.log("openViewHandler");
        // set event info from args
        setOpenView(true);
	};
    const openEditHandler = (data) => {
        console.log("openEditHandler");
        // set event info from args
        setButtonType('edit');
        setOpenView(true);
	};
    const closeViewHandler = () => {
        console.log("closeViewHandler");
        setOpenView(false);
	};

    const timestampToDate = (timestamp) => {
        let ts = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
        return dayjs(ts.toDate()).fromNow();
    }

    useEffect(()=>{
        console.log(`Showing TeamTab Component`);
        setUiLoading(false);
        setTeamData(renderTeamData);
    }, [props, userData, renderTeamData]);
    
    useEffect(()=>{
        console.log(teamData);
        console.log(teamData.id);
        if (updateTeamDataTrigger === true) {
            getTeamDataByID(teamData.id)
            .then((res) => {
                if (res.teamDocument) setTeamData(res.teamDocument);
            })
            .catch(() => {
                window.alert("TeamTab.js: No Team ID match.");
            })
            console.log("   one call");
        }
        setUpdateTeamDataTrigger(false);
    }, [teamData, updateTeamDataTrigger]);

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

            {/* New Event Popup */}
            <Dialog open={openNew} onClose={closeNewHandler}>
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
                        Assemble your team by creating a new event!
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
                    <Button onClick={submitHandler}  disabled={!eventName || !eventLocation || !eventStartDateTime || !eventEndDateTime }>
                        {buttonType === 'Edit' ? 'Save' : 'Submit'}
                    </Button>
                </DialogActions>
                </>)}
            </Dialog>

            {/* View Event Popup */}
            <Dialog open={openView} onClose={closeViewHandler}>

            </Dialog>


            {/* Pending/Answered/Completed Clusters */}
            <Grid className={classes.eventsGrid} container spacing={2}>
                {/* Pending Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Pending</Typography></Grid>
                { teamData.events.map((teamEvent,i) => {
                    if (teamEvent.status === "pending") {
                        return (<Grid item xs={12} sm={4} key={i} >
                            <Card className={classes.eventCard} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {teamEvent.eventName}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Created {timestampToDate(teamEvent.createdAt)}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        at {teamEvent.location}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={openViewHandler}>
                                        View
                                    </Button>
                                    <Button size="small" color="primary" onClick={openEditHandler}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="primary" onClick={deleteEventHandler}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>)
                    }
                })}  {/* End Pending */}

                {/* Completed Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Completed</Typography></Grid>
                { teamData.events.map((teamEvent,i) => {
                    if (teamEvent.status === "completed") {
                        return (<Grid item xs={12} sm={4} key={i} >
                            <Card className={classes.eventCard} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {teamEvent.eventName}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Created {timestampToDate(teamEvent.createdAt)}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        at {teamEvent.location}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={openViewHandler}>
                                        View
                                    </Button>
                                    <Button size="small" color="primary" onClick={openEditHandler}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="primary" onClick={deleteEventHandler}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>)
                    }
                })}  {/* End Completed */}
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