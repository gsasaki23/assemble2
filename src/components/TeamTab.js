// Utility Imports
import { useEffect, useState } from 'react';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const styles = (theme) => ({
    TeamTabTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black",
    }
});

const TeamTab = (props) => {
    const { classes, userData, teamID } = props;
    const [uiLoading, setUiLoading] = useState(true);


    useEffect(()=>{
        console.log("Showing TeamTab Component");
        console.log(userData);
        console.log(teamID);
        setUiLoading(false);
    }, [props, userData, teamID]);

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

            {/* army of cards here? */}

        </Container>
    </>
    );
};

export default withStyles(styles)(TeamTab);