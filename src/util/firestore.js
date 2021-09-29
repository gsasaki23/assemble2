// Firebase
import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";
// import { onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";

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

export {
    db, query, where, getDocs, addDoc, checkUIDExists, usersRef
}