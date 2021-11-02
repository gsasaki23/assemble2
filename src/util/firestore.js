// Firebase
import { getFirestore, collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
// import { onSnapshot, serverTimestamp } from "firebase/firestore";

// Firestore Configuration
const db = getFirestore();
const usersRef = collection(db, "users");
const teamsRef = collection(db, "teams");

const checkUIDExists = async (authUID) => {
    const uidCheckQuery = query(usersRef, where("authUID", "==", authUID));
    const uidQuerySnapshot = await getDocs(uidCheckQuery);
    if (uidQuerySnapshot.docs.length !== 1) {
        return {result: false};
    }
    let userDocument;
    uidQuerySnapshot.forEach((doc) => { userDocument = doc.data(); });
    return {result: true, userDocument};
}

const createUser = async (newUserData) => {
    const {userName, authType, authUID, firstName, lastName} = newUserData;
    let res = await addDoc(usersRef, {
        authType, authUID, firstName, lastName, 
        assembleUserName: userName,
        teams: [],
        createdAt: Timestamp.fromDate(new Date()),
    });
    return res;
}

const getTeamDataByID = async (teamId) => {
    const teamDocSnapshot = await getDoc(doc(db, "teams", teamId));
    let teamDocument = teamDocSnapshot.data();
    teamDocument.id = teamId;
    return { result: true, teamDocument };
}

const createEvent = async (teamId, newEventData) => {
    if (!teamId || !newEventData) return false;
    const {eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventNotes} = newEventData;
    let nextEventIdRef = await getDoc(doc(db, "config", "nextEventId"));
    let nextEventId = nextEventIdRef.data().eventId;

    await updateDoc(doc(db, "teams", teamId), {
        events: arrayUnion({
            eventId: nextEventId,
            eventName, 
            location: eventLocation,
            startDateTime: Timestamp.fromDate(eventStartDateTime),
            endDateTime: Timestamp.fromDate(eventEndDateTime),
            notes: eventNotes,
            invitedMembers: [],
            status: "pending",
            tasks: [],
            createdAt: Timestamp.fromDate(new Date()),
        })
    })

    nextEventId++;
    await updateDoc(doc(db, "config", "nextEventId"), {
        eventId: nextEventId
    })
    .catch(err=>console.log(err))

    return;
}

const updateEvent = async (teamId, updatedEventData) => {
    if (!teamId || !updatedEventData) return false;
    const teamDocRef = doc(db, "teams", teamId)
    const teamDocSnapshot = await getDoc(teamDocRef);
    let events = teamDocSnapshot.data().events;
    
    // Update matching eventId
    const {eventId, eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventNotes, eventStatusToSubmit} = updatedEventData;
    for (const event of events) {
        if (event.eventId === eventId) {
            event.eventName = eventName;
            event.location = eventLocation;
            event.startDateTime = eventStartDateTime;
            event.endDateTime = eventEndDateTime;
            event.notes = eventNotes;
            event.status = eventStatusToSubmit;
            break;
        }
    }

    // Update Call
    let res = await updateDoc(teamDocRef, { events })
    return res;
}

const deleteEvent = async (teamId, eventIdToDelete) => {
    if (!teamId || !eventIdToDelete) return false;
    const teamDocRef = doc(db, "teams", teamId)
    const teamDocSnapshot = await getDoc(teamDocRef);
    let events = teamDocSnapshot.data().events;
    events = events.filter(event => event.eventId !== eventIdToDelete);

    // Update Call
    let res = await updateDoc(teamDocRef, { events })
    return res;
}

export {
    db, query, where, getDocs, addDoc, Timestamp,
    usersRef, checkUIDExists, createUser, 
    teamsRef, getTeamDataByID, createEvent, updateEvent, deleteEvent
}