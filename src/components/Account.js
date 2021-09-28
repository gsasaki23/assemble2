import { useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
    accountTop:{
        margin: "10% 0% 0% 15%",
        backgroundColor: "red",
        textAlign: "center",
        border: "2px solid black",
    }
});

const Account = (props) => {
    const { classes } = props;

    useEffect(()=>{
        console.log("Showing Account Component");
    }, []);

    return (
        <>
            <h1 className={classes.accountTop}>Account</h1>
        </>
    );
};

export default withStyles(styles)(Account);