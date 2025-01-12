// components/auth/LogoutButton.js
export class LogoutButton extends HTMLElement {
    connectedCallback() {
        // Create button after element is connected to DOM
        const button = document.createElement('button');
        button.textContent = 'Logout';
        button.addEventListener('click', this.handleLogout.bind(this));
        this.appendChild(button);
    }

    handleLogout() {
        console.log('Logging out...');
        document.getElementById('auth-status').textContent = '';
        document.getElementById('user-content').style.display = 'none';
        document.getElementById('test-results').textContent = '';
        document.getElementById('user-text').value = '';
        window.history.replaceState(null, '', window.location.pathname);
        window.location.reload();
    }
}

customElements.define('logout-button', LogoutButton);
