import { useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
    todoTop:{
        margin: "10% 0% 0% 15%",
        backgroundColor: "blue",
        textAlign: "center",
        border: "2px solid black"
    }
});

const Todo = (props) => {
    const { classes } = props;

    useEffect(()=>{
        console.log("Showing Todo Component");
    }, []);

    return (
        <>
            <h1 className={classes.todoTop}>Todo</h1>
        </>
    );
};

export default withStyles(styles)(Todo);