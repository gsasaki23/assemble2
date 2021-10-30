// Utility Imports
import { useEffect, useState } from 'react';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@mui/material/Typography';

const styles = (theme) => ({
    dashboardTop:{
        textAlign: "center",
        textDecoration: "underline",
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
            <Typography variant="h3" mt={"7%"} className={classes.dashboardTop}>Dashboard</Typography>

            <h1>All pending events that await user response</h1>
            <h1>All pending events that already has user response</h1>
            <h1>Calendar View</h1>
            <h1>Create/Manage Teams (High Level)</h1>

        </Container>
    </>
    );
};

export default withStyles(styles)(Dashboard);