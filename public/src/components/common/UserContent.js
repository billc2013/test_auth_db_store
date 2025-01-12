// components/common/UserContent.js
export class UserContent extends HTMLElement {
    constructor() {
        super();
        
        // Create container div with id
        const container = document.createElement('div');
        container.id = 'user-content';
        container.style.display = 'none';
        
        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.id = 'user-text';
        textarea.rows = 4;
        textarea.cols = 50;
        
        // Create save button
        const saveButton = document.createElement('button');
        saveButton.id = 'save-text';
        saveButton.textContent = 'Save Text';
        
        // Append elements
        container.appendChild(textarea);
        container.appendChild(saveButton);
        this.appendChild(container);
        
        // Setup save handler
        this.setupSaveHandler();
    }

    async setupSaveHandler() {
        const { saveUserText } = await import('../../firebase/firestore-service.js');
        document.getElementById('save-text').onclick = async () => {
            const text = document.getElementById('user-text').value;
            const userEmail = localStorage.getItem('userEmail');
            await saveUserText(userEmail, text);
            alert('Text saved!');
        };
    }
}

customElements.define('user-content', UserContent);
