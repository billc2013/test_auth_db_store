// services/index.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { firebaseConfig } from '../firebase/firebase-config.js';

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
