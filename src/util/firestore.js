// Firebase
import { getFirestore, collection, getDocs, query, where, addDoc, Timestamp } from "firebase/firestore";
// import { onSnapshot, serverTimestamp } from "firebase/firestore";

// Firestore Configuration
const db = getFirestore();
const usersRef = collection(db, "users");

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

export {
    db, query, where, getDocs, addDoc, checkUIDExists, createUser, usersRef
}