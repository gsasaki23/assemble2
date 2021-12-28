// @material-ui Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const styles = (theme) => ({
    teamName:{
        textAlign: "center",
        textDecoration: "underline",
    },
    newButton: {
        position: 'fixed',
		bottom: 0,
		right: 0
    },
	pos: {
		marginBottom: 12
	},
    marginTop5: {
        marginTop: "5%"
    },
    verticalParent: {
        position: "relative",
    },
    verticalChild: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)"
    },
    uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
    center: {
        textAlign: "center"
    }
});

const ViewPopup = (props) => {
    const { classes, eventName, eventLocation, eventNotes, closeViewHandler } = props;
    // const { eventStartDateTime, eventEndDateTime, eventStatus } = props;

    return (<>
        <DialogTitle>{eventName}</DialogTitle>
        <DialogContent className={classes.center} >
            <DialogContentText>
                {eventNotes}
            </DialogContentText>
            <Typography variant="h5" component="h2">
                {eventName}
            </Typography>
            <Typography variant="body2" component="p">
                at {eventLocation}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeViewHandler}>
                Close
            </Button>
        </DialogActions>
    </>);
};

export default withStyles(styles)(ViewPopup);