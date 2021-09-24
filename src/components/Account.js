import { useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
    accountTop:{
        marginTop: "10%",
        backgroundColor: "red",
        textAlign: "center"
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