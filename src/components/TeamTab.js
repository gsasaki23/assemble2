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
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'



const styles = (theme) => ({
    TeamTabTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black",
    },
    appBar: {
        position: 'relative'
    },
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
        verticalAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
    newButton: {
        position: 'fixed',
		bottom: 0,
		right: 0
    },
    form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
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
});

const TeamTab = (props) => {
    const { classes, userData, teamName, teamsData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [teamData, setTeamData] = useState({});
    const [errors, setErrors] = useState([]);
    const [openNew, setOpenNew] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [buttonType, setButtonType] = useState('');
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
            <Dialog fullScreen open={openNew} onClose={closeNewHandler}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={closeNewHandler} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {buttonType === 'Edit' ? 'Edit Event' : 'Create a new Event'}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={submitHandler} className={classes.submitButton} >
                            {buttonType === 'Edit' ? 'Save' : 'Submit'}
                        </Button>
                    </Toolbar>
                </AppBar>

                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            Each Event input field here
                        </Grid>
                    </Grid>
                </form>
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