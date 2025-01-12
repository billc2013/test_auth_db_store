// components/auth/LoginButton.js
import { initiateLogin } from '../../auth/auth-service.js';

export class LoginButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<button id="login">Login</button>';
        this.addEventListener('click', this.handleLogin.bind(this));  // Bind to preserve context
    }

    async handleLogin() {
        try {
            // Call the imported function directly
            initiateLogin();
        } catch (error) {
            console.error('Login error:', error);
            // Show error to user
            const testResults = document.getElementById('test-results');
            if (testResults) {
                testResults.textContent = 'Login failed. Please try again.';
                testResults.style.color = 'red';
            }
        }
    }
}

customElements.define('login-button', LoginButton);
