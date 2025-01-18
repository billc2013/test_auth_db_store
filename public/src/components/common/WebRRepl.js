// components/common/WebRRepl.js
import { webrService } from '../../webr/webr-service.js';
import { webrState } from '../../webr/webr-state.js';

export class WebRRepl extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
    }

    connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        this.innerHTML = `
            <div id="repl-container" style="display: none;">
                <div id="input-container" style="margin: 20px 0; display: flex; gap: 10px;">
                    <input type="text" id="r-input" 
                           placeholder="Enter R code (e.g., 1 + 1)" 
                           style="flex-grow: 1; padding: 8px;">
                    <button id="run-button">Run</button>
                </div>
                <pre id="r-output" 
                     style="background-color: #f5f5f5; padding: 15px; 
                            border-radius: 4px; white-space: pre-wrap; 
                            min-height: 200px; max-height: 400px; 
                            overflow-y: auto; font-family: monospace;">
                </pre>
            </div>
        `;

        this.setupEventListeners();
    }

    async setupEventListeners() {
        const container = this.querySelector('#repl-container');
        const input = this.querySelector('#r-input');
        const runButton = this.querySelector('#run-button');
        const output = this.querySelector('#r-output');

        try {
            await webrService.initialize();
            container.style.display = 'block';
            output.textContent = 'R is ready! Try these examples:\n\n> 1 + 1\n> rnorm(10)';
            
            // Load previous state if it exists
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const hasState = await webrState.load(userEmail);
                if (hasState) {
                    output.textContent += '\n\nPrevious session loaded.';
                    if (webrState.lastOutput) {
                        output.textContent += `\n${webrState.lastOutput}`;
                    }
                }
            }
        } catch (error) {
            output.textContent = `Error initializing R: ${error.message}`;
            return;
        }

        const executeCode = async () => {
            const code = input.value.trim();
            if (!code) return;

            try {
                output.textContent += `\n\n> ${code}`;
                const result = await webrService.executeCode(code);
                output.textContent += `\n${result}`;

                // Save state
                const userEmail = localStorage.getItem('userEmail');
                if (userEmail) {
                    webrState.addCommand(code, result);
                    await webrState.save(userEmail);
                }

                input.value = '';
                output.scrollTop = output.scrollHeight;
            } catch (error) {
                output.textContent += `\nError: ${error.message}`;
            }
        };

        runButton.addEventListener('click', executeCode);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeCode();
        });
    }

    async cleanup() {
        await webrService.cleanup();
        webrState.clear();
    }
}

customElements.define('webr-repl', WebRRepl);