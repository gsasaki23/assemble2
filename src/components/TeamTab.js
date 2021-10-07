// Utility Imports
import { useEffect, useState } from 'react';
import { Timestamp } from '../util/firestore';
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
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';


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
    eventCard:{
        minWidth: 470
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
    const { classes, userData, teamName, teamsData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [teamData, setTeamData] = useState({});
    const [openNew, setOpenNew] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [buttonType, setButtonType] = useState('');
    // New Event Form States
    const [eventName, setEventName] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventStartDateTime, setEventStartDateTime] = useState(new Date());
    const [eventEndDateTime, setEventEndDateTime] = useState(new Date());
    const [eventNotes, setEventNotes] = useState("");
    const [errors, setErrors] = useState({});
    dayjs.extend(relativeTime);

    const tempEventButtonListener = e => {
        e.preventDefault();
        console.log(teamData);
    };

    // Update the respective state when typing
    const changeHandler = e => {
        console.log(e.target.name + " was changed");
	};

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
        console.log("submitHandler");
        console.log(e);
        // firestore api call for creating event
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
        console.log("Showing TeamTab Component");
        console.log(userData);
        console.log(teamName);
        console.log(teamsData);
        for (let team in teamsData) {
            if (teamsData[team].teamName === teamName) {
                setTeamData(teamsData[team]);
            }
        }
        setUiLoading(false);
    }, [props, userData, teamName, teamsData]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <Container component="main">
            <CssBaseline />
            <h1 className={classes.TeamTabTop}>TeamTab</h1>

            {/* New Event Popup */}
            <Dialog open={openNew} onClose={closeNewHandler}>
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
                                onChange={e => {
                                    if (e.target.value === ""){
                                        setErrors({...errors, eventName: "We need a name for your event!"});
                                    } else {
                                        if (errors.eventName) {
                                            let newErrors = {...errors};
                                            delete newErrors.eventName;
                                            setErrors(newErrors);
                                        } 
                                        setEventName(e);
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
                                onChange={(newValue) => {setEventLocation(newValue);}}
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
                                    onChange={(newValue) => {setEventStartDateTime(newValue);}}
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
                                    onChange={(newValue) => {
                                        console.log(eventStartDateTime);
                                        console.log(newValue);
                                        setEventEndDateTime(newValue);
                                    }}
                                    renderInput={(props) => <TextField {...props} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} className={classes.marginTop5}>
                            <TextField
                                id="eventNotes"
                                label="Notes"
                                fullWidth
                                multiline
                                rows={4}
                                onChange={(newValue) => {setEventNotes(newValue);}}
                            />
                        </Grid>

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
            </Dialog>

            {/* Pending/Answered/Completed Clusters */}
            <Grid className={classes.eventsGrid} container spacing={2}>
                {/* Pending Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Pending</Typography></Grid>
                { teamData.events.map((teamEvent,i) => (
                    <Grid item xs={12} sm={6} key={i} >
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
                    </Grid>
                ))}  {/* End Pending */}

                {/* Answered Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Answered</Typography></Grid>
                { teamData.events.map((teamEvent,i) => (
                    <Grid item xs={12} sm={6} key={i} >
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
                    </Grid>
                ))}  {/* End Answered */}

                {/* Completed Cluster */}
                <Grid item xs={12}><Typography variant="h5" component="h2">Completed</Typography></Grid>
                { teamData.events.map((teamEvent,i) => (
                    <Grid item xs={12} sm={6} key={i} >
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
                    </Grid>
                ))}  {/* End Completed */}
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