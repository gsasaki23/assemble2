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
    return {result: true, teamDocument: teamDocSnapshot.data()};
}

const createEvent = async (teamId, newEventData) => {
    if (!teamId || !newEventData) return false;
    const {eventName, eventLocation, eventStartDateTime, eventEndDateTime, eventNotes} = newEventData;
    const teamDocRef = doc(db, "teams", teamId)
    let res = await updateDoc(teamDocRef, {
        events: arrayUnion({
            eventId: 1,
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
    return res;
}

export {
    db, query, where, getDocs, addDoc, Timestamp,
    usersRef, checkUIDExists, createUser, 
    teamsRef, getTeamDataByID, createEvent
}