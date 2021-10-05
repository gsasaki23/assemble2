// Utility Imports
import { useEffect, useState } from 'react';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';

const styles = (theme) => ({
    dashboardTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black"
    }
});

const Dashboard = (props) => {
    const { classes, userData } = props;
    const [uiLoading, setUiLoading] = useState(true);


    useEffect(()=>{
        console.log("Showing Dashboard Component");
        // console.log(userData);
        setUiLoading(false);
    }, [props, userData]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <Container component="main">
            <CssBaseline />
            <h1 className={classes.dashboardTop}>Dashboard</h1>
            <h1 className={classes.dashboardTop}>All pending events that await user response</h1>
            <h1 className={classes.dashboardTop}>All pending events that already has user response</h1>
            <h1 className={classes.dashboardTop}>Calendar View</h1>
            <h1 className={classes.dashboardTop}>Create/Manage Teams (High Level)</h1>

        </Container>
    </>
    );
};

export default withStyles(styles)(Dashboard);