# /src/firebase/firestore-service.js
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const saveUserText = async (email, text) => {
    try {
        const docRef = doc(db, "userTexts", email);
        await setDoc(docRef, {
            text: text,
            lastUpdated: new Date()
        });
        console.log("Text saved for user:", email);
    } catch (e) {
        console.error("Error saving text:", e);
    }
};

export const loadUserText = async (email) => {
    try {
        const docRef = doc(db, "userTexts", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().text;
        }
        return '';
    } catch (e) {
        console.error("Error loading text:", e);
        return '';
    }
};