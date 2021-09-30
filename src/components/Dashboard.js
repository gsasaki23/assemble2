import { useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
    top:{
        margin: "10% 0% 0% 15%",
        backgroundColor: "blue",
        textAlign: "center",
        border: "2px solid black"
    }
});

const Dashboard = (props) => {
    const { classes } = props;

    useEffect(()=>{
        console.log("Showing Dashboard Component");
    }, []);

    return (
        <>
            <h1 className={classes.top}>Dashboard</h1>
        </>
    );
};

export default withStyles(styles)(Dashboard);