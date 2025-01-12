export class UserContent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div id="user-content" style="display: none;">
                <textarea id="user-text" rows="4" cols="50"></textarea>
                <button id="save-text">Save Text</button>
            </div>
        `;
        this.setupSaveHandler();
    }

    async setupSaveHandler() {
        const { saveUserText } = await import('../../firebase/firestore-service.js');
        this.querySelector('#save-text').onclick = async () => {
            const text = this.querySelector('#user-text').value;
            const userEmail = localStorage.getItem('userEmail'); // We'll need to store this during login
            await saveUserText(userEmail, text);
            alert('Text saved!');
        };
    }
}

customElements.define('user-content', UserContent);
