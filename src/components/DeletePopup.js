// Utility Imports
import { useEffect, useState } from 'react';
import { Timestamp, createEvent, updateEvent, deleteEvent, getTeamDataByID } from '../util/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
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
    const { classes, userData, renderTeamData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [teamData, setTeamData] = useState(renderTeamData);
    const [pendingEvents, setPendingEvents] = useState(renderTeamData.events.filter(teamEvent => teamEvent.status === "pending"));
    const [completedEvents, setCompletedEvents] = useState(renderTeamData.events.filter(teamEvent => teamEvent.status === "completed"));
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [updateTeamDataTrigger, setUpdateTeamDataTrigger] = useState(false);
    const [buttonType, setButtonType] = useState('');
    // New/Edit Event Form States
    const [openNewEdit, setOpenNewEdit] = useState(false);
    const [eventId, setEventId] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventStartDateTime, setEventStartDateTime] = useState(new Date());
    const [eventEndDateTime, setEventEndDateTime] = useState(new Date());
    const [eventNotes, setEventNotes] = useState("");
    const [eventStatus, setEventStatus] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    dayjs.extend(relativeTime);

    /*
        Handlers for Event "DELETE" Button
    */
    const openDeleteHandler = e => {
        e.preventDefault();

        // Find matching event ID
        let eventIdToDelete = parseInt(e.target.id.replaceAll("-delete",""));
        let eventToDelete = {};
        for (const event of teamData.events) {
            if (event.eventId === eventIdToDelete) {
                eventToDelete = event;
                break;
            } 
        }
        // TODO: Error handling
        if (eventToDelete === {}) return;

        // Set respective field into state
        setEventId(eventToDelete.eventId);
        setEventName(eventToDelete.eventName);

        setButtonType('Delete');
        setOpenDelete(true);    
    };
    const deleteEventHandler = e => {
        e.preventDefault();

        // Delete Call
        deleteEvent(teamData.id, eventId)
            .then(() => {
                // Alert?
                setSubmitLoading(false);
                setOpenDelete(false);
                setUpdateTeamDataTrigger(true);
            })
            .catch(() => {
                setErrors({...errors, submit: "error"})
                setSubmitLoading(false);
            })
	};
    const closeDeleteHandler = () => {
        setOpenDelete(false);
    }

    // DeletePopup Updated
    useEffect(()=>{
        console.log(`Showing DeletePopup Component`);
        setUiLoading(false);
        setTeamData(renderTeamData);
        setPendingEvents(renderTeamData.events.filter(teamEvent => teamEvent.status === "pending"));
        setCompletedEvents(renderTeamData.events.filter(teamEvent => teamEvent.status === "completed"));

    }, [props, userData, renderTeamData]);
    
    // TeamData Updated
    useEffect(()=>{
        if (updateTeamDataTrigger === true) {
            getTeamDataByID(teamData.id)
            .then((res) => {
                if (res.teamDocument) {
                    // console.log(res.teamDocument);
                    setTeamData(res.teamDocument);
                    setPendingEvents(res.teamDocument.events.filter(teamEvent => teamEvent.status === "pending"));
                    setCompletedEvents(res.teamDocument.events.filter(teamEvent => teamEvent.status === "completed"));
                } 
            })
            .catch(() => {
                window.alert("DeletePopup.js: No Team ID match.");
            })
            setUpdateTeamDataTrigger(false);
        }
        // eslint-disable-next-line
    }, [ updateTeamDataTrigger ]);

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