// firebase/firestore-service.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/index.js';  // Corrected import path with .js extension

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
        throw e; // Propagate error for handling in UI
    }
};

export const loadUserText = async (email) => {
    try {
        const docRef = doc(db, "userTexts", email);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().text : '';
    } catch (e) {
        console.error("Error loading text:", e);
        throw e;
    }
};
