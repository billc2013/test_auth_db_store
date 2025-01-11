export class LoginButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<button id="login">Login</button>';
        this.addEventListener('click', this.handleLogin);
    }

    handleLogin() {
        const { initiateLogin } = import('../../auth/auth-service.js');
        initiateLogin();
    }
}

customElements.define('login-button', LoginButton);