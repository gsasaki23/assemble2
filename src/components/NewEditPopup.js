// @material-ui Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';

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

const NewEditPopup = (props) => {
    const { classes, buttonType, setErrors, errors, setEventName, eventLocation, setEventLocation, eventStartDateTime, setEventStartDateTime, eventEndDateTime, setEventEndDateTime, eventNotes, setEventNotes, eventStatus, setEventStatus, closeNewEditHandler, editHandler, createNewHandler, eventName } = props;

    return (<>
        <DialogTitle>{buttonType === 'Edit' ? 'Edit Event' : 'Create Event'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {buttonType === 'Edit' 
                    ? 'Edit your event details!'
                    : 'Assemble your team by creating a new event!'}
            </DialogContentText>
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.marginTop5}>
                    <TextField 
                        id="eventName" 
                        name="eventName" 
                        variant="outlined" 
                        fullWidth 
                        required
                        label="Event Name" 
                        defaultValue={eventName}
                        onChange={e => {
                            if (e.target.value === ""){
                                setErrors({...errors, eventName: "We need to know what we're assembling for!"});
                            } else {
                                if (errors.eventName) {
                                    let newErrors = {...errors};
                                    delete newErrors.eventName;
                                    setErrors(newErrors);
                                } 
                                setEventName(e.target.value);
                            }
                        }}
                        helperText={errors.eventName} 
                        error={errors.eventName ? true : false}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        id="eventLocation" 
                        name="eventLocation" 
                        variant="outlined" 
                        fullWidth 
                        required
                        label="Location" 
                        defaultValue={eventLocation}
                        onChange={e => {
                            if (e.target.value === ""){
                                setErrors({...errors, eventLocation: "We need to know where to assemble!"});
                            } else {
                                if (errors.eventLocation) {
                                    let newErrors = {...errors};
                                    delete newErrors.eventLocation;
                                    setErrors(newErrors);
                                } 
                                setEventLocation(e.target.value);
                            }
                        }}
                        helperText={errors.eventLocation} 
                        error={errors.eventLocation ? true : false}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            id="eventStartDateTime" 
                            name="eventStartDateTime" 
                            variant="outlined" 
                            fullWidth 
                            required
                            label="Starting Date & Time"
                            value={eventStartDateTime}
                            onChange={(newValue) => { setEventStartDateTime(newValue.toDate()); }}
                            renderInput={(props) => <TextField {...props} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            id="eventEndDateTime" 
                            name="eventEndDateTime" 
                            variant="outlined" 
                            fullWidth 
                            label="Ending Date & Time"
                            value={eventEndDateTime}
                            onChange={(newValue) => { setEventEndDateTime(newValue.toDate()); }}
                            renderInput={(props) => <TextField {...props} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} className={classes.marginTop5}>
                    <TextField
                        id="eventNotes"
                        label="Notes (Optional)"
                        fullWidth
                        multiline
                        rows={4}
                        defaultValue={eventNotes}
                        onChange={e => {setEventNotes(e.target.value);}}
                    />
                </Grid>

                <Grid item xs={12} sm={6} className={classes.verticalParent}>
                    <DialogContentText className={classes.verticalChild}> Completion Status: {eventStatus ? 'Completed' : "Pending"} </DialogContentText>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Switch 
                        id="eventStatus" 
                        size="medium"
                        checked={eventStatus}
                        onChange={e => {
                            setEventStatus(e.target.checked);
                        }}
                    />
                </Grid>

                {/* If submit errors, show this */}
                {errors.submit
                ? (<Grid item xs={12} className={classes.marginTop5}>
                    <Alert severity="error">Something went wrong, please try again!</Alert>
                </Grid>)
                : (<></>)}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeNewEditHandler}>
                Cancel
            </Button>
            <Button onClick={buttonType === 'Edit' ? editHandler : createNewHandler}  disabled={!eventName || !eventLocation || !eventStartDateTime || !eventEndDateTime }>
                {buttonType === 'Edit' ? 'Save' : 'Submit'}
            </Button>
        </DialogActions>
    </>)
};

export default withStyles(styles)(NewEditPopup);