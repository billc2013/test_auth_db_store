// App.js
import { getUserInfo } from './auth/auth-service.js';
import { loadUserText } from './firebase/firestore-service.js';
import { setCurrentUser, clearAuth } from './services/index.js';
import './components/auth/LoginButton.js';
import './components/auth/LogoutButton.js';
import './components/common/UserContent.js';

class App {
    constructor() {
        this.handleAuthenticationResponse();
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
                    
                    setCurrentUser(userInfo, accessToken);
                    this.updateUI(userInfo.email);
                    await this.loadUserData(userInfo.email);
                }
            } catch (error) {
                console.error('Error in auth response handling:', error);
                clearAuth();
                this.showError('Authentication failed. Please try again.');
            }
        }
    }

    async updateUI(userEmail) {
        const authStatus = document.getElementById('auth-status');
        const userContent = document.getElementById('user-content');
        
        // Clear existing content
        authStatus.innerHTML = '';
        
        // Create a span for the email text
        const emailSpan = document.createElement('span');
        emailSpan.textContent = `Logged in as ${userEmail}! `;
        
        // Create logout button
        const logoutButton = document.createElement('logout-button');
        
        // Append both elements
        authStatus.appendChild(emailSpan);
        authStatus.appendChild(logoutButton);
        
        // Show user content
        userContent.style.display = 'block';
    }

    async loadUserData(userEmail) {
        try {
            const savedText = await loadUserText(userEmail);
            document.getElementById('user-text').value = savedText;
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showError('Failed to load your data. Please refresh the page.');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('test-results');
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
