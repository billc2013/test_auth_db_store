export class LogoutButton extends HTMLElement {
    constructor() {
        super();
        
        // Create the button in constructor
        const button = document.createElement('button');
        button.textContent = 'Logout';
        button.addEventListener('click', this.handleLogout.bind(this));
        
        // Append the button to the custom element
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
