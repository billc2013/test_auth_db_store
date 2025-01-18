// webr-service.js
import { WebR } from 'https://webr.r-wasm.org/v0.2.1/webr.mjs';

class WebRService {
    constructor() {
        this.webR = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            this.webR = new WebR({
                baseURL: 'https://webr.r-wasm.org/v0.2.1/'
            });
            
            await this.webR.init();
            this.isInitialized = true;
            
            return true;
        } catch (error) {
            console.error('WebR initialization failed:', error);
            throw error;
        }
    }

    async executeCode(code) {
        if (!this.isInitialized) {
            throw new Error('WebR not initialized');
        }

        try {
            const result = await this.webR.evalR(code);
            let output;

            try {
                const jsResult = await result.toJs();
                output = this.formatROutput(jsResult);
            } catch (conversionError) {
                output = await result.toString();
            }

            return output;
        } catch (error) {
            throw new Error(`R execution error: ${error.message}`);
        }
    }

    formatROutput(obj) {
        if (!obj || !obj.type) return '';

        switch (obj.type) {
            case 'double':
            case 'integer':
            case 'logical':
            case 'character':
                return `[1] ${obj.values.join(' ')}`;
            
            case 'list':
                return `List:\n${obj.values.map((val, i) => 
                    `[[${i + 1}]]\n${this.formatROutput(val)}`
                ).join('\n')}`;
            
            case 'data.frame':
                const colNames = obj.names || [];
                const rows = obj.values;
                return colNames.join('\t') + '\n' + 
                       rows.map(row => row.values.join('\t')).join('\n');
            
            default:
                return `Unsupported type: ${obj.type}`;
        }
    }

    async cleanup() {
        if (this.webR) {
            // Add any necessary cleanup here
            this.isInitialized = false;
            this.webR = null;
        }
    }
}

// Export a singleton instance
export const webrService = new WebRService();