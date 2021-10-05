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

const styles = (theme) => ({
    TeamTabTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black",
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
    dayjs.extend(relativeTime);

    const tempEventButtonListener = e => {
        e.preventDefault();
        console.log(teamData);
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

            <Grid className={classes.eventsGrid} container spacing={2}>
                <Grid item xs={12}><Typography variant="h5" component="h2">Pending</Typography></Grid>
                { teamData.events.map((teamEvent,i) => (
                    <Grid item xs={12} sm={6}>
                        <Card className={classes.eventCard} key={i} variant="outlined">
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
                                <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                    View
                                </Button>
                                <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                    Edit
                                </Button>
                                <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}  {/* End Pending */}

                <Grid item xs={12}><Typography variant="h5" component="h2">Answered</Typography></Grid>
                <Grid item xs={12} sm={6}>
                    <Card className={classes.eventCard} variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {"Event Name"}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Created {timestampToDate(teamData.createdAt)}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {`Event Description`}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                View
                            </Button>
                            <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                Edit
                            </Button>
                            <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                </Grid> {/* End Answered */}

                <Grid item xs={12}><Typography variant="h5" component="h2">Completed</Typography></Grid>
                <Grid item xs={12} sm={6}>
                    <Card className={classes.eventCard} variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {"Event Name"}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Created {timestampToDate(teamData.createdAt)}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {`Event Description`}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                View
                            </Button>
                            <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                Edit
                            </Button>
                            <Button size="small" color="primary" onClick={tempEventButtonListener}>
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                </Grid> {/* End Completed */}
            </Grid>
        </Container>
    </>
    );
};

export default withStyles(styles)(TeamTab);