// webr-state.js
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../services/index.js';

export class WebRState {
    constructor() {
        this.commandHistory = [];
        this.lastOutput = '';
        this.maxHistoryLength = 100; // Limit history length
    }

    addCommand(command, output) {
        this.commandHistory.push(command);
        this.lastOutput = output;

        // Keep history within limit
        if (this.commandHistory.length > this.maxHistoryLength) {
            this.commandHistory = this.commandHistory.slice(-this.maxHistoryLength);
        }
    }

    async save(userEmail) {
        if (!userEmail) {
            throw new Error('User email required to save state');
        }

        try {
            const docRef = doc(db, "replStates", userEmail);
            await setDoc(docRef, {
                commandHistory: this.commandHistory,
                lastOutput: this.lastOutput,
                lastUpdated: new Date()
            });
        } catch (error) {
            console.error('Error saving REPL state:', error);
            throw error;
        }
    }

    async load(userEmail) {
        if (!userEmail) {
            throw new Error('User email required to load state');
        }

        try {
            const docRef = doc(db, "replStates", userEmail);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                this.commandHistory = data.commandHistory || [];
                this.lastOutput = data.lastOutput || '';
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error loading REPL state:', error);
            throw error;
        }
    }

    clear() {
        this.commandHistory = [];
        this.lastOutput = '';
    }
}

// Export a singleton instance
export const webrState = new WebRState();