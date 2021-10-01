// Utility Imports
import { useEffect, useState } from 'react';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
// import Grid from '@material-ui/core/Grid';
// import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Button from '@material-ui/core/Button';

const styles = (theme) => ({
    TeamTabTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black",
    }
});

const TeamTab = (props) => {
    const { classes, userData, teamName, teamsData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [teamData, setTeamData] = useState({});


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
            <h1 className={classes.TeamTabTop}>Team Name: {teamName}</h1>
            <h1 className={classes.TeamTabTop}>Team Name: {teamData.teamName}</h1>

            {/* army of cards here? */}

        </Container>
    </>
    );
};

export default withStyles(styles)(TeamTab);