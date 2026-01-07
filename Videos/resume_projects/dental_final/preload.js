const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFormData: (data) => ipcRenderer.send('save-form-data', data),
    fetchFormData: () => ipcRenderer.invoke('fetch-form-data'),
    generatePDF: () => ipcRenderer.send('convert-to-pdf'),
    onFormDataFetched: (callback) => ipcRenderer.on('form-data-fetched', (event, data) => callback(data))
});

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, data) => callback(data))
});

// Wait for DOM to be ready before accessing elements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const noteButton = document.getElementById('noteButton');
        if (noteButton) {
            noteButton.addEventListener('click', () => {
                ipcRenderer.send('convert-to-pdf');
            });
        }
    });
} else {
    const noteButton = document.getElementById('noteButton');
    if (noteButton) {
        noteButton.addEventListener('click', () => {
            ipcRenderer.send('convert-to-pdf');
        });
    }
}