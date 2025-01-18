// App.js
import { getUserInfo } from './auth/auth-service.js';
import { loadUserText } from './firebase/firestore-service.js';
import { setCurrentUser, clearAuth, db } from './services/index.js';
import { disableNetwork } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Import components
import './components/auth/LoginButton.js';
import './components/common/UserContent.js';
import './components/common/WebRRepl.js';  // Add WebR REPL component

class App {
    constructor() {
        this.handleAuthenticationResponse();
        this.webrRepl = null;
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
                    await this.updateUI(userInfo.email);
                    await this.loadUserData(userInfo.email);
                    
                    // Initialize WebR REPL after authentication
                    this.initializeWebR();
                }
            } catch (error) {
                console.error('Error in auth response handling:', error);
                clearAuth();
                this.showError('Authentication failed. Please try again.');
            }
        }
    }

    initializeWebR() {
        // Get reference to WebR REPL component
        this.webrRepl = document.querySelector('webr-repl');
        // The component handles its own initialization when connected
    }

    async performLogout() {
        console.log('Starting logout process...');
        
        // Clear UI first
        document.getElementById('auth-status').textContent = '';
        document.getElementById('user-content').style.display = 'none';
        document.getElementById('test-results').textContent = '';
        
        try {
            // Cleanup WebR if initialized
            if (this.webrRepl) {
                await this.webrRepl.cleanup();
                this.webrRepl = null;
            }

            // Disable Firebase network
            await disableNetwork(db);
            
            // Wait for connections to close
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Clear auth state
            clearAuth();
            
            // Clear URL
            window.history.replaceState(null, '', window.location.pathname);
            
            // Now safe to reload
            window.location.reload();
        } catch (error) {
            console.error('Error during logout:', error);
            // Reload anyway as fallback
            window.location.reload();
        }
    }

    async updateUI(userEmail) {
        const authStatus = document.getElementById('auth-status');
        const userContent = document.querySelector('user-content');
        const webrRepl = document.querySelector('webr-repl');
        
        // Clear existing content
        authStatus.innerHTML = '';
        
        // Create email span
        const emailSpan = document.createElement('span');
        emailSpan.textContent = `Logged in as ${userEmail}! `;
        
        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = () => this.performLogout();
        
        // Append elements
        authStatus.appendChild(emailSpan);
        authStatus.appendChild(logoutBtn);
        
        // Show content sections
        userContent.style.display = 'block';
        if (webrRepl) {
            const replContainer = webrRepl.querySelector('#repl-container');
            if (replContainer) {
                replContainer.style.display = 'block';
            }
        }
    }

    async loadUserData(userEmail) {
        try {
            const savedText = await loadUserText(userEmail);
            const textArea = document.querySelector('#user-text');
            if (textArea) {
                textArea.value = savedText;
            }
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