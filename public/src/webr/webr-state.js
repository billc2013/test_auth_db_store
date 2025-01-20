// webr-state.js
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { db, storage } from '../services/index.js';

export class WebRState {
    constructor() {
        this.commandHistory = [];
        this.lastOutput = '';
        this.maxHistoryLength = 100;
        this.currentData = null;
        this.currentPlot = null;
    }

    addCommand(command, output) {
        this.commandHistory.push(command);
        this.lastOutput = output;

        if (this.commandHistory.length > this.maxHistoryLength) {
            this.commandHistory = this.commandHistory.slice(-this.maxHistoryLength);
        }
    }

    async savePlot(plotBlob) {
        if (!localStorage.getItem('userEmail')) {
            throw new Error('User email required to save plot');
        }

        const userEmail = localStorage.getItem('userEmail');
        const timestamp = new Date().getTime();
        const plotRef = ref(storage, `plots/${userEmail}/${timestamp}.png`);

        try {
            const snapshot = await uploadBytes(plotRef, plotBlob);
            const url = await getDownloadURL(snapshot.ref);
            this.currentPlot = url;

            // Save plot URL to Firestore
            const docRef = doc(db, "replStates", userEmail);
            const currentState = await getDoc(docRef);
            const plots = currentState.exists() ? 
                         (currentState.data().plots || []) : [];
            
            plots.push({
                url,
                timestamp,
                filename: `${timestamp}.png`
            });

            await this.save(userEmail, plots);
            return url;
        } catch (error) {
            console.error('Error saving plot:', error);
            throw error;
        }
    }

    async saveData(data) {
        this.currentData = data;
        await this.save(localStorage.getItem('userEmail'));
    }

    async save(userEmail, plots = null) {
        if (!userEmail) {
            throw new Error('User email required to save state');
        }

        try {
            const docRef = doc(db, "replStates", userEmail);
            await setDoc(docRef, {
                commandHistory: this.commandHistory,
                lastOutput: this.lastOutput,
                currentData: this.currentData,
                plots: plots || [],
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
                this.currentData = data.currentData || null;
                return {
                    hasState: true,
                    plots: data.plots || []
                };
            }
            
            return {
                hasState: false,
                plots: []
            };
        } catch (error) {
            console.error('Error loading REPL state:', error);
            throw error;
        }
    }

    clear() {
        this.commandHistory = [];
        this.lastOutput = '';
        this.currentData = null;
        this.currentPlot = null;
    }
}

// Export a singleton instance
export const webrState = new WebRState();