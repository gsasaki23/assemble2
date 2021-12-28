// @material-ui Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const styles = (theme) => ({
    center: {
        textAlign: "center"
    }
});

const DeletePopup = (props) => {
    const { classes, eventName, deleteEventHandler, closeDeleteHandler } = props;

    return (<>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent className={classes.center} >
            <DialogContentText>
                Are you sure? This can't be undone!
            </DialogContentText>
                <Button variant="contained" color="error" onClick={deleteEventHandler} >
                    Delete "{eventName}"!
                </Button>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDeleteHandler}>
                Cancel
            </Button>
        </DialogActions>
    </>);
};

export default withStyles(styles)(DeletePopup);