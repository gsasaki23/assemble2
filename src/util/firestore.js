// Firebase
import { getFirestore, collection, doc, getDoc, getDocs, query, where, addDoc, Timestamp } from "firebase/firestore";
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

export {
    db, query, where, getDocs, addDoc, Timestamp,
    usersRef, checkUIDExists, createUser, 
    teamsRef, getTeamDataByID
}