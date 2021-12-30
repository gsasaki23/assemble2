// @material-ui Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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
    const { classes, eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventStatus, eventNotes, closeViewHandler } = props;

    return (<>
        <DialogTitle>{eventName}</DialogTitle>

        <DialogContent>
            <Typography variant="body2" component="p">
                Location:  {eventLocation}
            </Typography>

            {/* <Typography variant="body2" component="p">
                From: {eventStartDateTime} To: {eventEndDateTime}
            </Typography> */}
            
            <Typography variant="body2" component="p">
                Notes: {eventNotes}
            </Typography>
            
            <Typography variant="body2" component="p">
                Status: {eventStatus}
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