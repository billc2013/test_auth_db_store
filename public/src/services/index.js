// services/index.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase-config';

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth state management
let currentUser = null;
let accessToken = null;

export const setCurrentUser = (user, token) => {
    currentUser = user;
    accessToken = token;
    localStorage.setItem('userEmail', user.email);
};

export const getCurrentUser = () => currentUser;
export const getAccessToken = () => accessToken;

export const clearAuth = () => {
    currentUser = null;
    accessToken = null;
    localStorage.removeItem('userEmail');
};
