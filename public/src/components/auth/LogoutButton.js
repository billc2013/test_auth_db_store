export class LogoutButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<button>Logout</button>';
        this.addEventListener('click', this.handleLogout);
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
