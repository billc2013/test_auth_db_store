// components/common/WebRRepl.js
import { webrService } from '../../webr/webr-service.js';
import { webrState } from '../../webr/webr-state.js';

export class WebRRepl extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.plotContainer = null;
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
                    <button id="plot-button">Create Plot</button>
                </div>
                <pre id="r-output" 
                     style="background-color: #f5f5f5; padding: 15px; 
                            border-radius: 4px; white-space: pre-wrap; 
                            min-height: 200px; max-height: 400px; 
                            overflow-y: auto; font-family: monospace;">
                </pre>
                <div id="plot-container" style="margin-top: 20px;"></div>
                <div id="saved-plots" style="margin-top: 20px;"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    async setupEventListeners() {
        const container = this.querySelector('#repl-container');
        const input = this.querySelector('#r-input');
        const runButton = this.querySelector('#run-button');
        const plotButton = this.querySelector('#plot-button');
        const output = this.querySelector('#r-output');
        this.plotContainer = this.querySelector('#plot-container');

        try {
            await webrService.initialize();
            container.style.display = 'block';
            output.textContent = 'R is ready! Try these examples:\n\n> 1 + 1\n> plot(cars)\n> hist(rnorm(100))';
            
            // Load previous state if it exists
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const { hasState, plots } = await webrState.load(userEmail);
                if (hasState) {
                    output.textContent += '\n\nPrevious session loaded.';
                    if (webrState.lastOutput) {
                        output.textContent += `\n${webrState.lastOutput}`;
                    }
                    if (plots.length > 0) {
                        this.displaySavedPlots(plots);
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

        const createPlot = async () => {
            const code = input.value.trim();
            if (!code) return;

            try {
                const plotBlob = await webrService.createPlot(code);
                const plotUrl = URL.createObjectURL(plotBlob);
                
                // Display the plot
                this.plotContainer.innerHTML = `<img src="${plotUrl}" alt="R Plot" style="max-width: 100%;">`;
                
                // Save the plot
                const userEmail = localStorage.getItem('userEmail');
                if (userEmail) {
                    const savedUrl = await webrState.savePlot(plotBlob);
                    output.textContent += `\nPlot saved successfully!\n`;
                }

                input.value = '';
            } catch (error) {
                output.textContent += `\nError creating plot: ${error.message}\n`;
            }
        };

        runButton.addEventListener('click', executeCode);
        plotButton.addEventListener('click', createPlot);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeCode();
        });
    }

    displaySavedPlots(plots) {
        const savedPlotsContainer = this.querySelector('#saved-plots');
        savedPlotsContainer.innerHTML = '<h3>Saved Plots</h3>';
        plots.forEach(plot => {
            const plotElement = document.createElement('div');
            plotElement.innerHTML = `
                <img src="${plot.url}" alt="Saved Plot" style="max-width: 100%; margin: 10px 0;">
                <div>Created: ${new Date(plot.timestamp).toLocaleString()}</div>
            `;
            savedPlotsContainer.appendChild(plotElement);
        });
    }

    async cleanup() {
        await webrService.cleanup();
        webrState.clear();
        URL.revokeObjectURL(this.plotContainer?.querySelector('img')?.src);
    }
}

customElements.define('webr-repl', WebRRepl);