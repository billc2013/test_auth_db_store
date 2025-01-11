# /src/App.js
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase/firebase-config.js';
import { getUserInfo } from './auth/auth-service.js';
import { loadUserText } from './firebase/firestore-service.js';
import './components/auth/LoginButton.js';
import './components/auth/LogoutButton.js';
import './components/common/UserContent.js';

export class App {
    constructor() {
        this.initializeFirebase();
        this.handleAuthenticationResponse();
    }

    initializeFirebase() {
        const app = initializeApp(firebaseConfig);
    }

    async handleAuthenticationResponse() {
        if (window.location.hash) {
            try {
                console.log('Starting auth response handling...');
                const params = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = params.get('access_token');
                
                if (accessToken) {
                    console.log('Got access token, fetching user info...');
                    const userInfo = await getUserInfo(accessToken);
                    console.log('User info retrieved:', userInfo);
                    
                    const userEmail = userInfo.email;
                    localStorage.setItem('userEmail', userEmail);

                    this.updateUI(userEmail);
                    await this.loadUserData(userEmail);
                }
            } catch (error) {
                console.error('Error in auth response handling:', error);
            }
        }
    }

    async updateUI(userEmail) {
        const authStatus = document.getElementById('auth-status');
        const userContent = document.getElementById('user-content');
        
        authStatus.textContent = `Logged in as ${userEmail}! `;
        authStatus.appendChild(document.createElement('logout-button'));
        userContent.style.display = 'block';
    }

    async loadUserData(userEmail) {
        const savedText = await loadUserText(userEmail);
        document.getElementById('user-text').value = savedText;
    }
}
